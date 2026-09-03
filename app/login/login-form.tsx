"use client";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureAuthPersistence,
  getFirebaseAuth,
  getPortalAccess,
} from "@/lib/portal/firebase-client";

const ACTIVATION_ERROR =
  "We couldn't activate your account. Please contact the production office for assistance.";

function isPermissionDenied(error: unknown) {
  const code = (error as { code?: string }).code;
  return code === "permission-denied" || code === "firestore/permission-denied";
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "activate">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function routeAuthenticatedUser(user: User) {
    const access = await getPortalAccess(user);
    if (access === "admin") {
      router.replace("/admin");
      return true;
    }
    if (access === "investor") {
      router.replace("/statement");
      return true;
    }
    await signOut(getFirebaseAuth());
    setMessage("Your account has not yet been authorised.");
    return false;
  }

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    let active = true;
    void ensureAuthPersistence().then(() => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
        if (user) {
          void routeAuthenticatedUser(user).catch((error) => {
            setMessage(
              isPermissionDenied(error)
                ? "Unable to verify account permissions."
                : "Unable to verify account access.",
            );
          });
        }
      });
    });
    return () => {
      active = false;
      unsubscribe();
    };
    // The router is stable; this observer should only be registered once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await ensureAuthPersistence();
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim().toLowerCase(),
        password,
      );
      await routeAuthenticatedUser(credential.user);
    } catch (error) {
      const code = (error as { code?: string }).code;
      setMessage(
        isPermissionDenied(error)
          ? "Unable to verify account permissions."
          : code?.startsWith("auth/")
            ? "The email address or password was not recognised."
            : "Unable to verify account access.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitActivation(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password.length < 6) {
      setMessage("Your password must be at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        code?: string;
      };

      if (body.code === "not-found") {
        setMessage(
          "We couldn't find an investor account associated with this email.",
        );
        return;
      }
      if (body.code === "already-activated") {
        setMessage(
          "This investor account has already been activated. Please use Log In or Forgot Password.",
        );
        return;
      }
      if (body.code !== "created" && body.code !== "existing-auth") {
        setMessage(ACTIVATION_ERROR);
        return;
      }

      await ensureAuthPersistence();
      try {
        const credential = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          normalizedEmail,
          password,
        );
        await routeAuthenticatedUser(credential.user);
      } catch {
        if (body.code === "existing-auth") {
          setMessage(
            "A sign-in account already exists for this email. Please use Log In or Forgot Password.",
          );
        } else {
          setMessage(ACTIVATION_ERROR);
        }
      }
    } catch {
      setMessage(ACTIVATION_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(
        getFirebaseAuth(),
        email.trim().toLowerCase(),
        { url: `${window.location.origin}/login` },
      );
      setMessage("If an account exists, a password reset email has been sent.");
    } catch {
      setMessage("If an account exists, a password reset email has been sent.");
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: "login" | "activate") {
    setMode(nextMode);
    setPassword("");
    setConfirmation("");
    setMessage("");
  }

  const activating = mode === "activate";
  return (
    <>
      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight text-[#173325]">
        {activating ? "ACTIVATE YOUR ACCOUNT" : "INVESTOR ACCESS"}
      </h1>
      <p className="mb-7 mt-3 text-center text-sm text-[#667169]">
        {activating
          ? "Enter the email address associated with your investment and create a password to access your investor portal."
          : "Sign in to view your latest investor statement."}
      </p>
      <form
        onSubmit={activating ? submitActivation : submitLogin}
        className="space-y-5"
      >
        <label className="portal-field">
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="portal-field">
          <span>{activating ? "Create password" : "Password"}</span>
          <input
            type="password"
            autoComplete={activating ? "new-password" : "current-password"}
            minLength={activating ? 6 : undefined}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {activating && (
          <label className="portal-field">
            <span>Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </label>
        )}
        {message && (
          <p
            role="status"
            className="rounded-lg bg-[#f3eee4] px-4 py-3 text-sm text-[#314338]"
          >
            {message}
          </p>
        )}
        <button className="portal-button w-full" disabled={busy} type="submit">
          {busy
            ? activating
              ? "Activating…"
              : "Logging in…"
            : activating
              ? "Activate account"
              : "Log in"}
        </button>
        {activating ? (
          <button
            className="block w-full text-center text-sm font-semibold text-[#3d5b49] underline-offset-4 hover:underline"
            disabled={busy}
            type="button"
            onClick={() => changeMode("login")}
          >
            Back to Log In
          </button>
        ) : (
          <>
            <button
              className="block w-full text-center text-sm font-semibold text-[#3d5b49] underline-offset-4 hover:underline"
              disabled={busy}
              type="button"
              onClick={resetPassword}
            >
              Forgot password
            </button>
            <button
              className="block w-full text-center text-sm font-semibold text-[#3d5b49] underline-offset-4 hover:underline"
              disabled={busy}
              type="button"
              onClick={() => changeMode("activate")}
            >
              First time here? Activate your account
            </button>
          </>
        )}
      </form>
    </>
  );
}

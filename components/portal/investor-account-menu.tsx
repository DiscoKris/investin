"use client";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getFirebaseAuth } from "@/lib/portal/firebase-client";

export function InvestorAccountMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || busy) return;
      if (passwordOpen) closePasswordDialog();
      else setMenuOpen(false);
    }
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [busy, passwordOpen]);

  function closePasswordDialog() {
    setPasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    setMessage("");
    setSuccess(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    if (newPassword.length < 6) {
      setMessage("Your new password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmation) {
      setMessage("Passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setMessage("Choose a new password that is different from your current password.");
      return;
    }

    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      await auth.authStateReady();
      const user = auth.currentUser;
      if (!user?.email) throw new Error("auth/session-expired");
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setSuccess(true);
      setMessage("Your password has been updated.");
    } catch (error) {
      const code = (error as { code?: string; message?: string }).code;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password"
      ) {
        setMessage("The current password was not recognised.");
      } else if (
        code === "auth/weak-password" ||
        code === "auth/password-does-not-meet-requirements"
      ) {
        setMessage("The new password does not meet the security requirements.");
      } else if (
        code === "auth/user-token-expired" ||
        code === "auth/user-disabled" ||
        code === "auth/session-expired"
      ) {
        setMessage("Your session has expired. Please log in again.");
      } else {
        setMessage("We couldn't update your password. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    await signOut(getFirebaseAuth()).catch(() => undefined);
    window.location.replace("/login");
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="rounded-lg border border-[#bfb6a6] bg-[#fffefa] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#31533e] hover:bg-white"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Account
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-30 mt-2 min-w-48 overflow-hidden rounded-lg border border-[#d8d0bf] bg-[#fffefa] py-1 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#31533e] hover:bg-[#f3eee4]"
              onClick={() => {
                setMenuOpen(false);
                setPasswordOpen(true);
              }}
            >
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full border-t border-[#e5dfd4] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#31533e] hover:bg-[#f3eee4]"
              onClick={() => void logout()}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {passwordOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              closePasswordDialog();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            className="w-full max-w-md rounded-xl bg-[#fffefa] p-6 shadow-2xl sm:p-8"
          >
            <p className="portal-kicker">Account security</p>
            <h2
              id="change-password-title"
              className="mt-1 text-2xl font-semibold text-[#183627]"
            >
              Change password
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#68746c]">
              Confirm your current password, then choose a new password for this portal.
            </p>
            <form onSubmit={changePassword} className="mt-6 space-y-4">
              <label className="portal-field">
                <span>Current password</span>
                <input
                  autoFocus
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
              <label className="portal-field">
                <span>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label className="portal-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </label>
              {message && (
                <p
                  role={success ? "status" : "alert"}
                  className={`rounded-lg px-4 py-3 text-sm ${
                    success
                      ? "bg-[#e8f0e9] text-[#31573b]"
                      : "bg-[#fff1ee] text-[#872f26]"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="portal-button portal-button-secondary"
                  disabled={busy}
                  onClick={closePasswordDialog}
                >
                  Close
                </button>
                <button type="submit" className="portal-button" disabled={busy}>
                  {busy ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

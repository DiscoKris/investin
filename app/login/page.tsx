import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Secure Investor Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="portal-page flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#d8d0bf] bg-[#fffdf8] p-7 shadow-2xl sm:p-10">
        <Image
          src="/assets/tswllogo.png"
          alt="To Sir, With Love"
          width={220}
          height={116}
          className="mx-auto h-16 w-auto brightness-0"
          priority
        />
        <div className="my-7 h-px bg-[#dfd5c3]" />
        <p className="portal-kicker text-center">To Sir, With Love</p>
        <LoginForm />
        <p className="mt-8 text-center text-xs leading-5 text-[#788078]">
          Access is restricted to authorised investors and administrators.
        </p>
      </section>
    </div>
  );
}

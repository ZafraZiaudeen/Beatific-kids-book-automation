import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8f2ff_0%,#fbfbff_42%,#fffdf7_100%)] p-6">
      <SignIn />
    </div>
  );
}

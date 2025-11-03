import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="rounded-box shadow-lg bg-base-100">
        <SignIn appearance={{ elements: { card: "shadow-none" } }} />
      </div>
    </div>
  );
}

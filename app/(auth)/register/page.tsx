import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <AuthForm
      mode="register"
      title="Create your banking profile"
      subtitle="Open a retail banking profile and start with a demo account."
    />
  );
}


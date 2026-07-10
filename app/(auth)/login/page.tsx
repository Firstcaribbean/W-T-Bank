import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      title="Sign in to your account"
      subtitle="Access your balances, transfers, cards, and support tools."
    />
  );
}


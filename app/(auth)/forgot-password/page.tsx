import { AuthForm } from "@/components/auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      mode="forgot"
      title="Reset your password"
      subtitle="We will send a secure reset link to your email address."
    />
  );
}

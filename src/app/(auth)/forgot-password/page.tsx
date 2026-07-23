import { AuthForm } from "@/components/auth/AuthForm";
import { forgotPasswordAction } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  return <AuthForm variant="forgot" action={forgotPasswordAction} />;
}

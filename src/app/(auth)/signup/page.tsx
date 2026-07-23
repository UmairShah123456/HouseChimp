import { AuthForm } from "@/components/auth/AuthForm";
import { signUpAction } from "@/lib/auth/actions";

export default function SignupPage() {
  return <AuthForm variant="signup" action={signUpAction} />;
}

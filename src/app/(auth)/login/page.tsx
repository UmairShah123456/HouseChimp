import { AuthForm } from "@/components/auth/AuthForm";
import { signInAction } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm variant="login" action={signInAction} next={next} />;
}

import { Loader } from "./Loader";

/**
 * Full-screen guest loading state — matches the guest portal's phone-width
 * column and page background, with a big loader and a friendly message so a
 * slow transition never looks like a blank page.
 */
export function GuestLoader({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-7 bg-page px-8 text-center">
      <Loader className="h-44 w-44" />
      <p className="max-w-[17rem] text-[26px] font-extrabold leading-tight text-ink">
        {message}
      </p>
    </div>
  );
}

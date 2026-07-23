import { Loader } from "@/components/guest/Loader";

/** Shown during guest page transitions while the next screen's data loads. */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] items-center justify-center bg-page">
      <Loader />
    </div>
  );
}

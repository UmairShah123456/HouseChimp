/** Shared result shape for form/server-action state (all fields optional so an
 *  empty initial `{}` is always assignable). Kept out of "use server" files,
 *  which may only export async functions. */
export type FormState = {
  error?: string;
  message?: string;
  ok?: boolean;
};

export type AuthState = FormState;

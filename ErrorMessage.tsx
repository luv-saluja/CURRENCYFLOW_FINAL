import { AlertIcon } from "./icons";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-wine/25 bg-wine/[0.06] px-3.5 py-3 text-sm text-wine dark:border-wine/30 dark:bg-wine/10 dark:text-[#E39BA1]"
    >
      <AlertIcon className="mt-0.5 shrink-0" width={16} height={16} />
      <p>{message}</p>
    </div>
  );
}

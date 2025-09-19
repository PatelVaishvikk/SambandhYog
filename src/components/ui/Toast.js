import { Toaster, toast as sonnerToast } from "sonner";

export function ToastContainer() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      toastOptions={{
        className: "rounded-2xl bg-white text-slate-700 border border-slate-200 shadow",
      }}
    />
  );
}

export const toast = {
  success: (message, options) => sonnerToast.success(message, options),
  error: (message, options) => sonnerToast.error(message, options),
  info: (message, options) => sonnerToast(message, options),
};


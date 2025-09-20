import { Toaster, toast as sonnerToast } from "sonner";

export function ToastContainer() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        className: "rounded-2xl border border-white/10 bg-night-700/90 text-slate-100 shadow-surface backdrop-blur-xl",
      }}
    />
  );
}

export const toast = {
  success: (message, options) => sonnerToast.success(message, options),
  error: (message, options) => sonnerToast.error(message, options),
  info: (message, options) => sonnerToast(message, options),
};


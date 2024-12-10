import { toast, ToastOptions } from "react-toastify";

export * from "./sort";

export const dumbTitalize = ({ text }: { text: string }) => {
  const strings = text.split(" ");

  return strings
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
    .join(" ");
};

export const copyToClipboardAndToast = ({
  text,
  message,
  toastOptions,
}: {
  text: string;
  message?: string;
  toastOptions?: ToastOptions;
}) => {
  navigator.clipboard
    .writeText(text)
    .then(() =>
      toast(message || "Copied link to clipboard", {
        type: "success",
        autoClose: 3000,
        ...toastOptions,
      }),
    )
    .catch(() => toast.error("Couldn't copy text to clipboard"));
};

export * from "./sort";

export const dumbTitalize = ({ text }: { text: string }) => {
  const strings = text.split(" ");

  return strings
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
    .join(" ");
};

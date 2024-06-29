import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MTG Combinator - Infinite combos, finite brain cells",
  description:
    "Find the answer to life's questions, namely, 'What combos do I run in my Magic: The Gathering deck?'",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
        <meta name="theme-color" content="#3581B8" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

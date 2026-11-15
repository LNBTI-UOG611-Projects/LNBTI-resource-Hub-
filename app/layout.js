import "./globals.css";

export const metadata = {
  title: "Sign in | LNBTI CampusFlow",
  description: "Sign in to your LNBTI CampusFlow workspace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
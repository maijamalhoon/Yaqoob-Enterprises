import localFont from "next/font/local";
import "./admin-ui.css";

const adminFont = localFont({
  src: "../../node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-admin",
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={"admin-root " + adminFont.variable}>{children}</div>;
}

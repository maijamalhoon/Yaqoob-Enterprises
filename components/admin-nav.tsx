import Link from "next/link";
import { BarChart3, Home, Images, MapPinned, Settings, Wrench } from "lucide-react";
import { Logo } from "@/components/logo";

const links = [
  ["Dashboard", "/admin", Home],
  ["Services", "/admin/services", Wrench],
  ["Coverage", "/admin/coverage", MapPinned],
  ["Gallery", "/admin/gallery", Images],
  ["Analytics", "/admin/analytics", BarChart3],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminNav() {
  return (
    <aside className="admin-nav">
      <Logo compact href="/admin" />
      <nav>
        {links.map(([label, href, Icon]) => (
          <Link key={href} href={href}><Icon size={18} />{label}</Link>
        ))}
      </nav>
      <Link className="admin-view-site" href="/" target="_blank">View public website</Link>
      <form action="/admin/logout" method="post"><button type="submit">Sign out</button></form>
    </aside>
  );
}

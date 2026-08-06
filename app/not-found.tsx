import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><div><span>404</span><h1>That page could not be found.</h1><p>The service or page may have moved.</p><Link className="button button--primary" href="/">Return home</Link></div></main>;
}

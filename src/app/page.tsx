import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
      <footer className="py-12 px-6 text-center border-t border-card-border bg-background">
        <p className="text-sm text-secondary">
          © {new Date().getFullYear()} Portfolio. Built with Next.js &amp; Tailwind.
        </p>
      </footer>
    </main>
  );
}

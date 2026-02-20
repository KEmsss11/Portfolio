import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Contact />
      <footer className="py-12 px-6 text-center border-t border-card-border bg-background">
        <p className="text-sm text-secondary">
          © {new Date().getFullYear()} Portfolio. Built with Next.js &amp; Tailwind.
        </p>
      </footer>
    </main>
  );
}

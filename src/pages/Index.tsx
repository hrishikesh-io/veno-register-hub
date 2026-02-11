import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";
import { Github, MapPin } from "lucide-react";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onRegisterClick={scrollToForm} />
      <RegistrationForm ref={formRef} />
      <footer className="py-8 px-4 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-body">Developed by</span>
            <a
              href="https://github.com/hrishikesh-io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" /> hrishikesh-io
            </a>
            <a
              href="https://github.com/kannan-io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" /> kannan-io
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Ven-O-vation State Tech Fest</p>
            <a
              href="https://maps.app.goo.gl/KX7JAq4kF2W6MYaq9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4" /> MVGM GPC Vennikulam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

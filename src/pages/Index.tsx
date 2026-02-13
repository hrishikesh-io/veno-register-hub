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
      <footer className="py-10 px-4 border-t border-border bg-card/50">
        <div className="container flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span className="font-body">Developed by</span>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/hrishikesh-io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" /> hrishikesh-io
              </a>
              <span className="text-border">|</span>
              <a
                href="https://github.com/TheRealAdityaxXD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" /> TheRealAdityaxXD
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <a
              href="https://maps.app.goo.gl/KX7JAq4kF2W6MYaq9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4" /> MVGM GPC Vennikulam
            </a>
          </div>
          <p className="text-xs text-muted-foreground/60">© 2026 Ven-O-vation State Tech Fest</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

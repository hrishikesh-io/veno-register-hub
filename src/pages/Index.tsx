import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onRegisterClick={scrollToForm} />
      <RegistrationForm ref={formRef} />
      <footer className="py-8 text-center text-muted-foreground text-sm font-body border-t border-border">
        <p>© 2026 Ven-O-vation Tech Fest · MVGM GPC Vennikulam</p>
      </footer>
    </div>
  );
};

export default Index;

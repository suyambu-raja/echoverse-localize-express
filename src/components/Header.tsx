import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EchoVerse</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/demo')} className="text-sm font-medium hover:text-primary transition-colors">
              Demo
            </button>
            <button onClick={() => navigate('/features')} className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => navigate('/how-it-works')} className="text-sm font-medium hover:text-primary transition-colors">
              How it Works
            </button>
            <button onClick={() => navigate('/pricing')} className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button size="sm" className="shadow-glow" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

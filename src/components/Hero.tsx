import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Video Localization</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
            Speak to the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Entire World
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Transform your videos into 175+ languages with perfect voice cloning, 
            lip-sync, and cultural adaptation—all in minutes, not days.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button size="lg" className="group shadow-glow" onClick={() => navigate('/auth')}>
              Start Localizing Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Try Video Call
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">175+</div>
              <div className="text-sm text-muted-foreground mt-1">Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">&lt;5min</div>
              <div className="text-sm text-muted-foreground mt-1">Per Video Min</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">90%</div>
              <div className="text-sm text-muted-foreground mt-1">Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

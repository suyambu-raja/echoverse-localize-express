import { Card } from "@/components/ui/card";
import { Mic2, Languages, Smile, Video, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Voice Identity Preservation",
    description: "Clone any voice with just 3 seconds of audio. Maintain speaker identity, emotion, and style across all languages.",
  },
  {
    icon: Video,
    title: "Perfect Lip-Sync",
    description: "Advanced facial mapping ensures your speakers' lip movements match the translated audio flawlessly.",
  },
  {
    icon: Languages,
    title: "Cultural Adaptation",
    description: "Beyond translation—adapt idioms, humor, and cultural references to resonate with local audiences.",
  },
  {
    icon: Smile,
    title: "Emotion Detection",
    description: "Preserve tone, emotion, and prosody. AI detects and replicates sentiment across languages.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with consent tracking, encryption, and regional data residency options.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Live streaming mode with <30s latency. Perfect for webinars, events, and broadcasts.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4" id="features">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Go Global</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade AI pipeline that handles every step of video localization
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 gradient-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

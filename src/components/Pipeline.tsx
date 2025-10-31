import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const steps = [
  { number: "01", title: "Upload", desc: "Drag & drop your video" },
  { number: "02", title: "Transcribe", desc: "ASR with speaker diarization" },
  { number: "03", title: "Translate", desc: "MT with cultural adaptation" },
  { number: "04", title: "Clone Voice", desc: "Few-shot voice synthesis" },
  { number: "05", title: "Lip-Sync", desc: "Facial alignment & retiming" },
  { number: "06", title: "QC & Publish", desc: "Automated checks & distribution" },
];

export const Pipeline = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One-Click{" "}
            <span className="text-primary">Pipeline</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From upload to publish in minutes. Our AI handles every step of the localization workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 h-full gradient-card border-border hover:border-primary/50 transition-all duration-300">
                <div className="text-5xl font-bold text-primary/20 mb-3">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </Card>
              
              {index < steps.length - 1 && index % 3 !== 2 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

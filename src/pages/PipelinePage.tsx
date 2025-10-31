import { Header } from "@/components/Header";
import { Pipeline } from "@/components/Pipeline";
import { Footer } from "@/components/Footer";

const PipelinePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Pipeline />
      </main>
      <Footer />
    </div>
  );
};

export default PipelinePage;

import { Header } from "@/components/Header";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { ArrowLeft, Play, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEMO_VIDEOS = {
  en: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big Buck Bunny",
    description: "Original English Version"
  },
  es: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Big Buck Bunny",
    description: "Spanish Localized Version"
  },
  fr: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Big Buck Bunny",
    description: "French Localized Version"
  },
  de: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Big Buck Bunny",
    description: "German Localized Version"
  },
  ja: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "Big Buck Bunny",
    description: "Japanese Localized Version"
  },
  zh: {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    title: "Big Buck Bunny",
    description: "Chinese Localized Version"
  }
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

const Demo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(DEMO_VIDEOS.en);

  useEffect(() => {
    setCurrentVideo(DEMO_VIDEOS[selectedLanguage as keyof typeof DEMO_VIDEOS]);
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setIsProcessing(true);
    setSelectedLanguage(language);
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Language switched",
        description: `Video localized to ${LANGUAGES.find(l => l.code === language)?.name}`,
      });
    }, 1500);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your localized video is being prepared",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">Video Localization Demo</h1>
            </div>
            <div className="w-24" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-white text-lg">Localizing video...</p>
                      </div>
                    </div>
                  )}
                  <video
                    key={currentVideo.url}
                    className="w-full h-full"
                    controls
                    src={currentVideo.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
                  <p className="text-muted-foreground">{currentVideo.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Play Localized
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Language Selection</h3>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-medium text-sm">Quick Switch</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                      <Button
                        key={lang.code}
                        variant={selectedLanguage === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(lang.code)}
                        className="text-2xl"
                      >
                        {lang.flag}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Features Demo</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="font-medium">Voice Cloning</p>
                      <p className="text-muted-foreground">AI-powered voice matching</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="font-medium">Lip Sync</p>
                      <p className="text-muted-foreground">Accurate mouth movement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="font-medium">Cultural Adaptation</p>
                      <p className="text-muted-foreground">Context-aware translation</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <h3 className="text-lg font-semibold">Try Live AI Call</h3>
                <p className="text-sm text-muted-foreground">
                  Experience real-time multilingual conversation with AI
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Start AI Call Demo
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;

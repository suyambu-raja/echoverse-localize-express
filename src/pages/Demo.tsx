import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { ArrowLeft, Play, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Single video URL - same video plays for all languages
const VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const LOCALIZED_CONTENT = {
  en: {
    title: "Manager-Employee Performance Review",
    description: "Department Manager discussing quarterly goals with team member",
    speakers: "Manager: David Martinez | Employee: Sarah Johnson",
    captions: [
      "Manager: Good morning Sarah, please have a seat.",
      "Employee: Thank you, Mr. Martinez.",
      "Manager: Let's discuss your Q3 performance. Your sales numbers exceeded targets by 15%.",
      "Employee: I appreciate that. The new client onboarding process really helped.",
      "Manager: Excellent work. For Q4, we'd like you to mentor two junior team members.",
      "Employee: I'd be honored to help develop the team.",
      "Manager: Great. We'll also increase your project budget by 20%.",
      "Employee: Thank you for the confidence in my work."
    ]
  },
  es: {
    title: "Revisión de Desempeño Gerente-Empleado",
    description: "Gerente de departamento discutiendo objetivos trimestrales con miembro del equipo",
    speakers: "Gerente: David Martinez | Empleada: Sarah Johnson",
    captions: [
      "Gerente: Buenos días Sarah, por favor siéntate.",
      "Empleada: Gracias, Sr. Martinez.",
      "Gerente: Hablemos de tu desempeño en el Q3. Tus números de ventas superaron los objetivos en un 15%.",
      "Empleada: Lo aprecio. El nuevo proceso de incorporación de clientes realmente ayudó.",
      "Gerente: Excelente trabajo. Para el Q4, nos gustaría que mentorizaras a dos miembros junior del equipo.",
      "Empleada: Sería un honor ayudar a desarrollar al equipo.",
      "Gerente: Genial. También aumentaremos tu presupuesto de proyecto en un 20%.",
      "Empleada: Gracias por la confianza en mi trabajo."
    ]
  },
  fr: {
    title: "Évaluation de Performance Manager-Employé",
    description: "Chef de département discutant des objectifs trimestriels avec un membre de l'équipe",
    speakers: "Manager: David Martinez | Employée: Sarah Johnson",
    captions: [
      "Manager: Bonjour Sarah, asseyez-vous s'il vous plaît.",
      "Employée: Merci, M. Martinez.",
      "Manager: Parlons de votre performance au Q3. Vos chiffres de vente ont dépassé les objectifs de 15%.",
      "Employée: J'apprécie cela. Le nouveau processus d'intégration client a vraiment aidé.",
      "Manager: Excellent travail. Pour le Q4, nous aimerions que vous mentorisez deux membres juniors de l'équipe.",
      "Employée: Je serais honorée d'aider à développer l'équipe.",
      "Manager: Parfait. Nous augmenterons également votre budget de projet de 20%.",
      "Employée: Merci pour la confiance dans mon travail."
    ]
  },
  de: {
    title: "Manager-Mitarbeiter Leistungsbeurteilung",
    description: "Abteilungsleiter bespricht vierteljährliche Ziele mit Teammitglied",
    speakers: "Manager: David Martinez | Mitarbeiterin: Sarah Johnson",
    captions: [
      "Manager: Guten Morgen Sarah, bitte setzen Sie sich.",
      "Mitarbeiterin: Danke, Herr Martinez.",
      "Manager: Sprechen wir über Ihre Q3-Leistung. Ihre Verkaufszahlen übertrafen die Ziele um 15%.",
      "Mitarbeiterin: Das schätze ich. Der neue Kundeneinführungsprozess hat wirklich geholfen.",
      "Manager: Ausgezeichnete Arbeit. Für Q4 möchten wir, dass Sie zwei Junior-Teammitglieder betreuen.",
      "Mitarbeiterin: Es wäre mir eine Ehre, das Team zu entwickeln.",
      "Manager: Großartig. Wir werden auch Ihr Projektbudget um 20% erhöhen.",
      "Mitarbeiterin: Danke für das Vertrauen in meine Arbeit."
    ]
  },
  ja: {
    title: "マネージャーと従業員の業績評価",
    description: "部門マネージャーがチームメンバーと四半期目標について話し合う",
    speakers: "マネージャー: David Martinez | 従業員: Sarah Johnson",
    captions: [
      "マネージャー: おはようございます、サラ、座ってください。",
      "従業員: ありがとうございます、マルティネスさん。",
      "マネージャー: Q3のパフォーマンスについて話しましょう。あなたの売上数字は目標を15%上回りました。",
      "従業員: 感謝します。新しいクライアントオンボーディングプロセスが本当に役立ちました。",
      "マネージャー: 素晴らしい仕事です。Q4では、2人のジュニアチームメンバーを指導してほしいと思います。",
      "従業員: チームを育成できることを光栄に思います。",
      "マネージャー: 素晴らしい。プロジェクト予算も20%増やします。",
      "従業員: 私の仕事への信頼に感謝します。"
    ]
  },
  zh: {
    title: "经理-员工绩效评估",
    description: "部门经理与团队成员讨论季度目标",
    speakers: "经理: David Martinez | 员工: Sarah Johnson",
    captions: [
      "经理: 早上好，Sarah，请坐。",
      "员工: 谢谢，Martinez先生。",
      "经理: 让我们讨论一下你的第三季度表现。你的销售数字超过目标15%。",
      "员工: 我很感激。新的客户入职流程真的很有帮助。",
      "经理: 出色的工作。第四季度，我们希望你指导两名初级团队成员。",
      "员工: 我很荣幸能帮助发展团队。",
      "经理: 太好了。我们还会将你的项目预算增加20%。",
      "员工: 感谢您对我工作的信任。"
    ]
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
  const [currentContent, setCurrentContent] = useState(LOCALIZED_CONTENT.en);

  useEffect(() => {
    setCurrentContent(LOCALIZED_CONTENT[selectedLanguage as keyof typeof LOCALIZED_CONTENT]);
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
          <div className="flex items-center justify-between mb-4">
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

          <Card className="p-4 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Live Conversation Localization</h3>
                <p className="text-sm text-muted-foreground">
                  Watch how the same business conversation seamlessly transforms across languages. 
                  Each version maintains the original speakers' voices, lip sync, and cultural context. 
                  Switch between languages to see the AI-powered localization in action.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-white text-lg">Switching language...</p>
                      </div>
                    </div>
                  )}
                  <video
                    className="w-full h-full"
                    controls
                    src={VIDEO_URL}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Localized Audio Version</span>
                  </div>
                  <h2 className="text-xl font-semibold">{currentContent.title}</h2>
                  <p className="text-muted-foreground">{currentContent.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Speakers:</span>
                    <span className="text-muted-foreground">{currentContent.speakers}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded" />
                      Captions ({LANGUAGES.find(l => l.code === selectedLanguage)?.name})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-muted/30 rounded-lg">
                      {currentContent.captions.map((caption, index) => (
                        <p key={index} className="text-sm leading-relaxed">
                          {caption}
                        </p>
                      ))}
                    </div>
                  </div>
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
                <h3 className="text-lg font-semibold">Conversation Details</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Scenario: Performance Review Meeting</p>
                    <p className="text-muted-foreground">
                      A department manager conducting a quarterly performance review with a team member, discussing achievements and future goals.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t space-y-3">
                    <p className="font-medium">AI Localization Features:</p>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <p className="font-medium">Voice Cloning</p>
                        <p className="text-muted-foreground">Original speaker voices preserved</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <p className="font-medium">Lip Sync</p>
                        <p className="text-muted-foreground">Perfect mouth movement sync</p>
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
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <h3 className="text-lg font-semibold">Start Your Project</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your videos and localize them to any language
                </p>
                <Button onClick={() => navigate('/workspace')} className="w-full">
                  Go to Workspace
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

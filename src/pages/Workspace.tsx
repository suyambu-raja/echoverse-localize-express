import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, LogOut, Languages, Play } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];

interface Project {
  id: string;
  name: string;
  source_video_url: string;
  source_language: string;
  created_at: string;
  localizations?: Array<{
    id: string;
    target_language: string;
    caption_text: string | null;
    status: string;
  }>;
}

export default function Workspace() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploading, setUploading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [captionText, setCaptionText] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProjects(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProjects(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProjects = async (userId: string) => {
    const { data: projectsData, error } = await supabase
      .from("projects")
      .select(`
        *,
        localizations (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProjects(projectsData || []);
  };

  const handleVideoUpload = async () => {
    if (!selectedVideo || !projectName || !user) {
      toast({
        title: "Missing information",
        description: "Please select a video and enter a project name",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload video to storage
      const fileExt = selectedVideo.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, selectedVideo);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          source_video_url: publicUrl,
          source_language: sourceLanguage,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create localizations for selected languages
      if (selectedLanguages.length > 0) {
        const localizations = selectedLanguages.map((lang) => ({
          project_id: project.id,
          target_language: lang,
          status: "pending",
        }));

        const { error: locError } = await supabase
          .from("localizations")
          .insert(localizations);

        if (locError) throw locError;
      }

      toast({
        title: "Success",
        description: "Video uploaded and project created!",
      });

      // Reset form
      setProjectName("");
      setSelectedVideo(null);
      setSelectedLanguages([]);
      loadProjects(user.id);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode]
    );
  };

  const viewProject = (project: Project) => {
    setCurrentProject(project);
    setCaptionText(project.localizations?.[0]?.caption_text || "");
  };

  const saveCaptions = async () => {
    if (!currentProject || !user) return;

    try {
      // Update or create caption for current project
      if (currentProject.localizations && currentProject.localizations.length > 0) {
        const { error } = await supabase
          .from("localizations")
          .update({ caption_text: captionText })
          .eq("project_id", currentProject.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Captions saved successfully!",
      });

      loadProjects(user.id);
    } catch (error: any) {
      toast({
        title: "Error saving captions",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Workspace</h1>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        {!currentProject ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Video
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <Label htmlFor="source-language">Source Language</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger id="source-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="video-file">Video File</Label>
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4" />
                    Target Languages
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {LANGUAGES.filter(l => l.code !== sourceLanguage).map((lang) => (
                      <div key={lang.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang.code}
                          checked={selectedLanguages.includes(lang.code)}
                          onCheckedChange={() => toggleLanguage(lang.code)}
                        />
                        <label
                          htmlFor={lang.code}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {lang.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleVideoUpload}
                  disabled={uploading || !selectedVideo || !projectName}
                  className="w-full"
                >
                  {uploading ? "Uploading..." : "Create Project"}
                </Button>
              </div>
            </Card>

            {/* Projects List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No projects yet. Upload your first video to get started!
                  </p>
                ) : (
                  projects.map((project) => (
                    <Card
                      key={project.id}
                      className="p-4 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => viewProject(project)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {LANGUAGES.find((l) => l.code === project.source_language)?.name}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.localizations?.map((loc) => (
                              <span
                                key={loc.id}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                              >
                                {LANGUAGES.find((l) => l.code === loc.target_language)?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>
        ) : (
          // Video Player View
          <div className="max-w-5xl mx-auto">
            <Button
              onClick={() => setCurrentProject(null)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Projects
            </Button>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{currentProject.name}</h2>

              <div className="space-y-6">
                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    src={currentProject.source_video_url}
                    controls
                    className="w-full"
                  />
                  {captionText && (
                    <div className="absolute bottom-16 left-0 right-0 text-center">
                      <p className="bg-black/80 text-white px-4 py-2 inline-block rounded">
                        {captionText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Caption Editor */}
                <div>
                  <Label htmlFor="captions">Captions</Label>
                  <Input
                    id="captions"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder="Enter captions for this video"
                    className="mt-2"
                  />
                  <Button onClick={saveCaptions} className="mt-2">
                    Save Captions
                  </Button>
                </div>

                {/* Localizations */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Localizations
                  </h3>
                  <div className="grid gap-2">
                    {currentProject.localizations?.map((loc) => (
                      <Card key={loc.id} className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {LANGUAGES.find((l) => l.code === loc.target_language)?.name}
                          </span>
                          <span className="text-sm px-2 py-1 bg-accent rounded">
                            {loc.status}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

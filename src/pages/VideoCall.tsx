import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

const VideoCall = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcript, setTranscript] = useState<string[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    if (event.type === 'response.audio_transcript.delta') {
      setTranscript(prev => {
        const newTranscript = [...prev];
        if (newTranscript.length > 0 && newTranscript[newTranscript.length - 1].startsWith('AI: ')) {
          newTranscript[newTranscript.length - 1] += event.delta;
        } else {
          newTranscript.push('AI: ' + event.delta);
        }
        return newTranscript;
      });
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      setTranscript(prev => [...prev, 'You: ' + event.transcript]);
    }
  };

  const startCall = async () => {
    if (!user) return;

    try {
      const languageInstructions = `You are a helpful AI assistant in a video call. Speak naturally and conversationally in ${LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'}. Be friendly, engaging, and helpful.`;

      const { data, error } = await supabase.functions.invoke('realtime-token', {
        body: { language: selectedLanguage, instructions: languageInstructions }
      });

      if (error) throw error;

      if (!data.client_secret?.value) {
        throw new Error("Failed to get session token");
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('call_sessions')
        .insert({
          user_id: user.id,
          language: selectedLanguage
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      sessionIdRef.current = sessionData.id;

      chatRef.current = new RealtimeChat(handleMessage, data.client_secret.value);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Call started",
        description: `Connected in ${LANGUAGES.find(l => l.code === selectedLanguage)?.name}`,
      });
    } catch (error: any) {
      console.error('Error starting call:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to start call',
        variant: "destructive",
      });
    }
  };

  const endCall = async () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setTranscript([]);

    if (sessionIdRef.current) {
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionIdRef.current);
      sessionIdRef.current = null;
    }

    toast({
      title: "Call ended",
      description: "The call has been disconnected",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EchoVerse Video Call
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Exit to Home
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                {isConnected ? (
                  <>
                    <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                      <Mic className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">AI is listening...</p>
                  </>
                ) : (
                  <>
                    <Phone className="w-24 h-24 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Select language and start call</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Language</label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  disabled={isConnected}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {!isConnected ? (
                  <Button onClick={startCall} className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={endCall} 
                      variant="destructive" 
                      className="flex-1"
                    >
                      <PhoneOff className="w-4 h-4 mr-2" />
                      End Call
                    </Button>
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      variant="outline"
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversation Transcript</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transcript.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Transcript will appear here during the call...
                </p>
              ) : (
                transcript.map((line, index) => (
                  <p key={index} className="text-sm">
                    {line}
                  </p>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

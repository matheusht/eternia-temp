import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { generateOracleResponse, generateGreeting } from "@/utils/localOracle";
import { AppLayout } from "@/components/AppLayout";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIOracle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, addActivity } = useUserData();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Initialize conversation when profile is loaded
  useEffect(() => {
    if (profile && messages.length === 0) {
      const greetingText = generateGreeting({
        displayName: profile.display_name,
        birthDate: profile.birth_date,
        birthTime: profile.birth_time,
        birthLocation: profile.birth_location,
        goal: profile.goal,
        currentLevel: profile.current_level
      });
      
      const greeting: Message = {
        id: "1",
        text: greetingText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [profile, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !profile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Add activity for IA consultation
      await addActivity('ia_consulta');
      
      // Generate local oracle response (no API costs)
      const oracleResponse = generateOracleResponse({
        message: currentMessage,
        userData: {
          displayName: profile.display_name,
          birthDate: profile.birth_date,
          birthTime: profile.birth_time,
          birthLocation: profile.birth_location,
          goal: profile.goal,
          currentLevel: profile.current_level
        }
      });

      // Simulate thinking time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: oracleResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in Local Oracle:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "The energies are a bit unstable at the moment. Let me reconnect... Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-mystic flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const suggestions = [
    "How is my energy today?",
    "What do the stars say about my love life?",
    "What ritual should I do this week?",
    "How can I improve my spirituality?"
  ];

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-playfair ethereal-text">Personalized Consultation</h1>
          </div>

          <Card className="mystic-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Mystic Oracle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 rounded-lg bg-gradient-mystic">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-primary/20'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-primary/20 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                        <span className="text-sm text-muted-foreground ml-2">
                          The oracle is consulting the stars...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your question to the oracle..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Questions */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(suggestion)}
                      disabled={isLoading}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIOracle;
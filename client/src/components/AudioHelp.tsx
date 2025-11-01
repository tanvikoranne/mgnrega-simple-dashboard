import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

interface AudioHelpProps {
  text: string;
  textMarathi: string;
}

export function AudioHelp({ text, textMarathi }: AudioHelpProps) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (utterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [utterance]);

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = language === "en" ? text : textMarathi;
    const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
    newUtterance.lang = language === "en" ? "en-IN" : "mr-IN";
    newUtterance.rate = 0.9;
    newUtterance.pitch = 1.0;
    newUtterance.volume = 1.0;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language === "en" ? "en" : "mr") ||
        voice.lang.startsWith("hi")
      );
      if (preferredVoice) {
        newUtterance.voice = preferredVoice;
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    newUtterance.onend = () => {
      setIsPlaying(false);
    };

    newUtterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsPlaying(false);
    };

    setUtterance(newUtterance);
    setIsPlaying(true);
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(newUtterance);
    } catch (error) {
      console.error("Failed to speak:", error);
      setIsPlaying(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleSpeak}
      className={`rounded-full ${isPlaying ? "text-primary" : ""}`}
      data-testid="button-audio-help"
    >
      {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </Button>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function AiChatButton() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(true);
  
  // Hide the button on the AI assistant page
  useEffect(() => {
    setVisible(location !== "/ai-assistant");
  }, [location]);
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        asChild
        className="bg-primary-600 hover:bg-primary-700 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
      >
        <a href="/ai-assistant">
          <i className="fas fa-robot text-xl"></i>
        </a>
      </Button>
    </div>
  );
}

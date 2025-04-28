import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import ChatMessage from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send } from "lucide-react";
import { InsertMessage } from "@shared/schema";

export default function AiAssistant() {
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // For demo purposes, we're using user ID 1
  const userId = 1;
  
  // Fetch message history
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: [`/api/messages/${userId}`],
  });
  
  // Initialize with welcome message if no messages
  useEffect(() => {
    if (!messagesLoading && (!messages || messages.length === 0)) {
      // Add welcome message from bot
      sendMessageMutation.mutate({
        userId,
        content: "Welcome to SolarFlow Support!",
        isBot: true
      });
    }
  }, [messagesLoading, messages]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: InsertMessage) => {
      const res = await apiRequest("POST", "/api/messages", messageData);
      return await res.json();
    },
    onSuccess: () => {
      // Refetch messages
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${userId}`] });
    }
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Send user message
    sendMessageMutation.mutate({
      userId,
      content: inputMessage,
      isBot: false
    });
    
    // Clear input
    setInputMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  // Quick reply buttons
  const quickReplies = [
    "Panel cleaning",
    "Inverter issues",
    "Battery problems"
  ];

  return (
    <Layout>
      <div className="space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SolarFlow AI Assistant</h1>
            <p className="text-gray-600">Get instant help with your solar system questions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-lg"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">SolarBot</h3>
                  <p className="text-xs text-gray-500">Online • Responds instantly</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages && messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      content={message.content} 
                      isBot={message.isBot} 
                    />
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 flex gap-2">
                {quickReplies.map((reply) => (
                  <Button 
                    key={reply}
                    variant="outline"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700" 
                    onClick={() => {
                      setInputMessage(reply);
                    }}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <button className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">How do I clean my solar panels?</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  We recommend using water and a soft brush with an extension pole. Clean early morning or evening when panels are cool. Never use abrasive materials or harsh chemicals.
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <button className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">How often should I service my system?</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div className="mt-2 text-sm text-gray-600 hidden">
                  Professional maintenance is recommended annually to ensure optimal performance. This includes electrical checks, panel cleaning, and inverter inspection.
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <button className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">Why is my battery not charging fully?</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div className="mt-2 text-sm text-gray-600 hidden">
                  This could be due to insufficient sunlight, battery degradation, or controller issues. Check system settings and contact support if the problem persists.
                </div>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <button className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">How do I reset my inverter?</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div className="mt-2 text-sm text-gray-600 hidden">
                  Turn off AC and DC disconnect switches, wait 5 minutes, then turn them back on. Consult your model's manual for specific instructions.
                </div>
              </div>
              
              <div>
                <button className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">What does the error code E-14 mean?</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                <div className="mt-2 text-sm text-gray-600 hidden">
                  E-14 typically indicates a communication error between the inverter and monitoring system. Try restarting both components and check your network connection.
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Can't find what you need?</h3>
              <p className="text-sm text-gray-600 mb-4">Our support team is ready to help with more complex issues</p>
              <Button asChild className="w-full">
                <a href="/new-ticket">Create Support Ticket</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

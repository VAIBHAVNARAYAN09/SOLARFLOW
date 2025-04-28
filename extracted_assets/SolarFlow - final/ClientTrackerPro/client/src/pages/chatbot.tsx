import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ChatInterface from "@/components/chatbot/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Info, 
  FileText, 
  HelpCircle, 
  TicketCheck,
  AlertCircle
} from "lucide-react";

export default function Chatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header title="AI Assistant" setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ChatInterface />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    About AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our AI Assistant is designed to help with common solar panel queries, 
                    providing quick solutions to technical issues, maintenance advice, 
                    and general information about your solar installation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Suggested Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="text-sm hover:text-primary cursor-pointer">
                      "Why is my solar panel not working?"
                    </li>
                    <li className="text-sm hover:text-primary cursor-pointer">
                      "How often should I clean my solar panels?"
                    </li>
                    <li className="text-sm hover:text-primary cursor-pointer">
                      "What affects solar panel efficiency?"
                    </li>
                    <li className="text-sm hover:text-primary cursor-pointer">
                      "How do I check my system performance?"
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <TicketCheck className="h-5 w-5 text-primary" />
                    Need Human Support?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    If the AI Assistant can't resolve your issue, our support team is ready to help.
                  </p>
                  <div className="flex justify-between">
                    <a className="text-sm text-primary hover:underline" href="/tickets">
                      Create Support Ticket
                    </a>
                    <a className="text-sm text-primary hover:underline" href="tel:+919876543210">
                      Call Support
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

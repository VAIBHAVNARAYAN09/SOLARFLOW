import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

export default function ChatMessage({ content, isBot }: ChatMessageProps) {
  // Function to convert URLs to hyperlinks
  const formatContent = (text: string) => {
    // Split content by newlines to support bullet points
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Check if line is a bullet point
      const isBulletPoint = line.trim().startsWith("- ") || line.trim().startsWith("• ");
      
      // For numbered lists
      const isNumberedPoint = /^\d+\.\s/.test(line.trim());
      
      if (isBulletPoint || isNumberedPoint) {
        return <li key={index}>{line.replace(/^-\s|•\s/, "")}</li>;
      }
      
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div
      className={cn(
        "chatbot-message max-w-4/5 mb-3 px-4 py-3 rounded-lg",
        isBot
          ? "bg-gray-100 text-gray-900 rounded-tr-lg rounded-br-lg rounded-bl-lg ml-0"
          : "bg-primary-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg ml-auto"
      )}
    >
      {isBot ? (
        <div className="prose prose-sm max-w-none">
          {formatContent(content)}
        </div>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
}

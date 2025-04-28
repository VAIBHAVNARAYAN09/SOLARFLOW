import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { Activity } from "@shared/schema";
import { CheckCircle, AlertCircle, Clock, RefreshCw, UserPlus } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  // Determine icon and colors based on activity action
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "created":
        return { 
          icon: <AlertCircle className="h-4 w-4" />, 
          bg: "bg-blue-100 dark:bg-blue-900", 
          color: "text-blue-600 dark:text-blue-400" 
        };
      case "updated":
        return { 
          icon: <RefreshCw className="h-4 w-4" />, 
          bg: "bg-amber-100 dark:bg-amber-900", 
          color: "text-amber-600 dark:text-amber-400" 
        };
      case "resolved":
        return { 
          icon: <CheckCircle className="h-4 w-4" />, 
          bg: "bg-green-100 dark:bg-green-900", 
          color: "text-green-600 dark:text-green-400" 
        };
      case "assigned":
        return { 
          icon: <UserPlus className="h-4 w-4" />, 
          bg: "bg-purple-100 dark:bg-purple-900", 
          color: "text-purple-600 dark:text-purple-400" 
        };
      default:
        return { 
          icon: <Clock className="h-4 w-4" />, 
          bg: "bg-gray-100 dark:bg-gray-800", 
          color: "text-gray-600 dark:text-gray-400" 
        };
    }
  };
  
  const { icon, bg, color } = getActivityIcon(activity.action);
  
  // Placeholder user data - would be fetched from API in production
  const user = {
    initials: getInitials("John Doe"),
    name: "John Doe",
  };
  
  // Extract ticket number and subject from activity details
  const ticketMatch = activity.details?.match(/#(\d+)/);
  const ticketId = ticketMatch ? ticketMatch[1] : "";
  
  // Extract subject from details after the ticket number
  const subjectMatch = activity.details?.match(/#\d+\s(.*?)$/);
  const subject = subjectMatch ? subjectMatch[1] : activity.details || "";
  
  // Format the activity title based on action type
  const getActivityTitle = () => {
    const formattedAction = activity.action === "resolved" 
      ? "was resolved" 
      : activity.action === "assigned" 
        ? "was assigned" 
        : `was ${activity.action}`;
    
    return (
      <>
        {ticketId ? (
          <span>
            Ticket <span className="font-medium">#{ticketId}</span> {formattedAction}
          </span>
        ) : (
          <span>{formattedAction}</span>
        )}
      </>
    );
  };
  
  return (
    <div className="flex items-start gap-3 py-3 border-t first:border-0 border-slate-200 dark:border-slate-700">
      <div className={`h-8 w-8 ${bg} ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
          {getActivityTitle()}
        </p>
        {subject && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subject}</p>}
        <div className="flex items-center gap-2 mt-1.5">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{user.initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activity.action === "assigned" ? "to" : "by"} {user.name} • {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

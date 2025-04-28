import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

// Combine class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to human-readable string
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

// Format time to human-readable string
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "h:mm a");
}

// Format date and time to human-readable string
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy h:mm a");
}

// Format relative time (e.g., "5 minutes ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Get initials from a name
export function getInitials(name: string): string {
  if (!name) return "";
  
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}

// Get status color based on status value
export function getStatusColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status.toLowerCase()) {
    case "new":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "in progress":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "resolved":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "closed":
      return { bg: "bg-gray-100", text: "text-gray-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

// Get priority color based on priority value
export function getPriorityColor(priority: string): {
  bg: string;
  text: string;
} {
  switch (priority.toLowerCase()) {
    case "low":
      return { bg: "bg-gray-100", text: "text-gray-800" };
    case "medium":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "high":
      return { bg: "bg-red-100", text: "text-red-800" };
    case "critical":
      return { bg: "bg-red-500", text: "text-white" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

// Get activity icon and color based on action type
export function getActivityMeta(action: string): {
  icon: string;
  bg: string;
  text: string;
} {
  switch (action.toLowerCase()) {
    case "created":
      return {
        icon: "ticket-alt",
        bg: "bg-blue-100",
        text: "text-blue-700",
      };
    case "updated":
      return {
        icon: "user-edit",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };
    case "resolved":
      return {
        icon: "check-circle",
        bg: "bg-green-100",
        text: "text-green-700",
      };
    case "assigned":
      return {
        icon: "exchange-alt",
        bg: "bg-primary-100",
        text: "text-primary-700",
      };
    default:
      return {
        icon: "info-circle",
        bg: "bg-gray-100",
        text: "text-gray-700",
      };
  }
}

// Generate mock ticket stats for placeholder areas
export function generateMockStats() {
  return {
    openTickets: 42,
    inProgressTickets: 15,
    resolvedToday: 18,
    avgResponseTime: 2.4,
    customerSatisfaction: 94,
  };
}

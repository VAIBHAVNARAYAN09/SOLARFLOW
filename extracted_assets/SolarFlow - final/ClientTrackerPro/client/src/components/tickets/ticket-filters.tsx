import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TicketFilter {
  name: string;
  value: string;
  count: number;
}

interface TicketFiltersProps {
  filters: TicketFilter[];
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

export default function TicketFilters({ filters, activeFilter, setActiveFilter }: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          className={cn("text-sm", 
            activeFilter === filter.value 
              ? "bg-primary text-white" 
              : "bg-background text-foreground hover:bg-muted"
          )}
          onClick={() => setActiveFilter(filter.value)}
        >
          {filter.name} ({filter.count})
        </Button>
      ))}
    </div>
  );
}

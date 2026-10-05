"use client";

import { useEffect, useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { useAppRole } from "@/features/auth/role-context";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  type: string;
}

export default function ReleaseCalendarPage() {
  const role = useAppRole();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    fetch(`/api/calendar?month=${month}&year=${year}&type=release`)
      .then((response) => response.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));
  }, [currentDate]);

  return (
    <div>
      <PageHeader
        eyebrow="Calendar"
        title="Release Calendar"
        description="Month view. An entry opens the request."
      />
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onPrevMonth={() => setCurrentDate((date) => subMonths(date, 1))}
            onNextMonth={() => setCurrentDate((date) => addMonths(date, 1))}
            deliveryHref={role === "comms" || role === "lead" ? "/delivery-calendar" : undefined}
          />
        </div>
      </div>
    </div>
  );
}

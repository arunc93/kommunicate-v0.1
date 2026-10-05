"use client";

import { useEffect, useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  type: string;
}

export default function DeliveryCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    fetch(`/api/calendar?month=${month}&year=${year}&type=delivery`)
      .then((response) => response.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));
  }, [currentDate]);

  return (
    <div>
      <PageHeader title="Delivery Calendar" />
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onPrevMonth={() => setCurrentDate((date) => subMonths(date, 1))}
            onNextMonth={() => setCurrentDate((date) => addMonths(date, 1))}
            releaseHref="/release-calendar"
          />
        </div>
      </div>
    </div>
  );
}

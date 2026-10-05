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
    fetch(
      `/api/calendar?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}&type=delivery`
    )
      .then((r) => r.json())
      .then(setEvents);
  }, [currentDate]);

  return (
    <div>
      <PageHeader title="Delivery Calendar" />
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        legend={[
          { label: "Delivery", type: "delivery" },
          { label: "Release", type: "release" },
        ]}
      />
    </div>
  );
}

"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  type: string;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  legend?: { label: string; type: string }[];
  highlightToday?: boolean;
}

export function CalendarGrid({
  currentDate,
  events,
  onPrevMonth,
  onNextMonth,
  legend,
  highlightToday = true,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), day));

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#0a192f] text-white px-6 py-3 flex items-center justify-between">
        <button onClick={onPrevMonth} className="hover:opacity-80 transition-opacity">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-lg">
            {format(currentDate, "MMMM yyyy")}
          </span>
          {legend && (
            <div className="flex gap-4 text-sm">
              {legend.map((l) => (
                <span key={l.type} className="flex items-center gap-1.5 text-[#4ebce9]">
                  <span className="text-xs">📅</span> {l.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={onNextMonth} className="hover:opacity-80 transition-opacity">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center text-sm font-semibold text-[#1a2b4b]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, currentDate);
          const today = highlightToday && isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] border border-gray-100 p-1.5",
                !inMonth && "bg-gray-50",
                today && "ring-2 ring-[#4ebce9] ring-inset bg-blue-50/30"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  inMonth ? "text-[#1a2b4b]" : "text-gray-300"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-[10px] text-white px-1.5 py-0.5 rounded truncate"
                    style={{ backgroundColor: event.color }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-400 text-center">▼</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

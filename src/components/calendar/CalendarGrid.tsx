"use client";

import Link from "next/link";
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
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventChipColor } from "@/features/calendar/event-color";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  type: string;
  href?: string;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  releaseHref?: string;
  deliveryHref?: string;
  highlightToday?: boolean;
}

export function CalendarGrid({
  currentDate,
  events,
  onPrevMonth,
  onNextMonth,
  releaseHref,
  deliveryHref,
  highlightToday = true,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day: Date) => events.filter((event) => isSameDay(new Date(event.date), day));

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
      <div className="flex items-center justify-between gap-2 bg-navy px-4 py-3 text-white">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="rounded-md p-1 hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-wrap items-center justify-center gap-4 md:gap-8">
          {(deliveryHref || releaseHref) &&
            (deliveryHref ? (
              <Link href={deliveryHref} className="flex items-center gap-1.5 text-sm text-light-blue hover:underline">
                <Calendar className="h-4 w-4" /> Delivery
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-light-blue">
                <Calendar className="h-4 w-4" /> Delivery
              </span>
            ))}
          <span className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</span>
          {(deliveryHref || releaseHref) &&
            (releaseHref ? (
              <Link href={releaseHref} className="flex items-center gap-1.5 text-sm text-light-blue hover:underline">
                <Calendar className="h-4 w-4" /> Release
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-light-blue">
                <Calendar className="h-4 w-4" /> Release
              </span>
            ))}
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="rounded-md p-1 hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-surface">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-center text-sm font-semibold text-text">
            {day}
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
                "min-h-[100px] border border-border p-1.5",
                !inMonth && "bg-surface",
                today && "bg-light-blue/40 ring-1 ring-inset ring-cobalt",
              )}
            >
              <span className={cn("text-xs font-medium", inMonth ? "text-text" : "text-text-muted")}>
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.map((event) => {
                  const chip = (
                    <div
                      className="truncate rounded-sm px-1.5 py-0.5 text-[10px] leading-4 text-white"
                      style={{ backgroundColor: eventChipColor(event.color) }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  );
                  return event.href ? (
                    <Link key={event.id} href={event.href} className="block">
                      {chip}
                    </Link>
                  ) : (
                    <div key={event.id}>{chip}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

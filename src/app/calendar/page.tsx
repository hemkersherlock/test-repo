
"use client"

import CalendarView from "@/components/calendar-view";

export default function CalendarPage() {
  return (
    <main className="flex justify-center bg-background min-h-full">
      <div className="w-full max-w-lg">
        <CalendarView />
      </div>
    </main>
  );
}

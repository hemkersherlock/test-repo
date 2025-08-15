import CalendarView from "@/components/calendar-view";

export default function Home() {
  return (
    <main className="flex justify-center bg-background">
      <div className="w-full max-w-lg bg-card shadow-2xl">
        <CalendarView />
      </div>
    </main>
  );
}

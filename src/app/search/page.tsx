
"use client";

import AddShowModal from "@/components/add-show-modal";

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-3xl font-headline font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">
            Use the floating button on the Home or Calendar pages to add a new show.
        </p>
        {/* The AddShowModal is now globally available and controlled by context */}
        <AddShowModal />
    </div>
  );
}

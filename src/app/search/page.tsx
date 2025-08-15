
"use client";

import { useState } from "react";
import AddShowModal from "@/components/add-show-modal";
import type { Event } from "@/lib/events";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-3xl font-headline font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">
            Use the floating button on the Home or Calendar pages to add a new show.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4">Open Add Modal</Button>
        <AddShowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

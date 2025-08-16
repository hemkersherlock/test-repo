
"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddShowModal from "@/components/add-show-modal";
import BottomNav from "@/components/bottom-nav";
import { useCine } from "@/context/cine-context";
import { useToast } from "@/hooks/use-toast";

export default function AppLayoutClient({ children }: { children: ReactNode }) {
  const { setModalOpen, setSelectedItem } = useCine();
  const { toast } = useToast();

  const openAddModal = () => {
    toast({
        title: "Search for a show",
        description: "You can only schedule items that have been added from the search results.",
    });
  };

  return (
    <div className="relative flex flex-col h-screen">
      <main className="flex-grow pb-20">
        {children}
      </main>
      
      <Button
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
        size="icon"
        onClick={openAddModal}
        aria-label="Add new show"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <BottomNav />
      <AddShowModal />
    </div>
  );
}

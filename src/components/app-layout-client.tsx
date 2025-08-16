
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddShowModal from "@/components/add-show-modal";
import BottomNav from "@/components/bottom-nav";
import { useCine } from "@/context/cine-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayoutClient({ children }: { children: ReactNode }) {
  const { setFabAction } = useCine();
  const pathname = usePathname();
  const router = useRouter();

  const handleFabClick = () => {
    // If we're on the home page, trigger the focus action
    if (pathname === '/') {
      setFabAction(true);
    } else {
      // If we're on another page, navigate to home and then the action will be triggered
      router.push('/');
      // A small delay to allow navigation before setting the action
      setTimeout(() => setFabAction(true), 100);
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      <main className="flex-grow pb-20">
         <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Button
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90"
        size="icon"
        onClick={handleFabClick}
        aria-label="Add new show"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <BottomNav />
      <AddShowModal />
    </div>
  );
}

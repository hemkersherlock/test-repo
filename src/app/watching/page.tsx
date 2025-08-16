
"use client";

import { useState, useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import WatchingCard from "@/components/watching-card";
import { Input } from '@/components/ui/input';
import { Search, Clapperboard, Check, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCine } from '@/context/cine-context';
import UpdateProgressModal from '@/components/update-progress-modal';
import type { CineItem, Status } from '@/lib/types';
import EmptyState from '@/components/empty-state';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "pb-2 text-sm font-medium capitalize transition-colors relative",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {label} ({count})
    {isActive && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
  </button>
);


export default function WatchingPage() {
  const { items, setSelectedItem, setUpdateModalOpen } = useCine();
  const [activeTab, setActiveTab] = useState<Status>('watching');
  const [filterQuery, setFilterQuery] = useState('');

  const handleItemClick = (item: CineItem) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [items, filterQuery]);

  const watchingFiltered = filteredItems.filter(item => item.status === 'watching');
  const completedFiltered = filteredItems.filter(item => item.status === 'completed');
  const watchlistFiltered = filteredItems.filter(item => item.status === 'watchlist');

  const tabs: { id: Status; label: string; items: CineItem[], icon: React.ReactNode, empty: { title: string, desc: string }}[] = [
    { id: 'watching', label: 'Watching', items: watchingFiltered, icon: <Clapperboard className="w-12 h-12" />, empty: { title: 'Nothing Here', desc: 'Items you are actively watching will appear here.' } },
    { id: 'completed', label: 'Completed', items: completedFiltered, icon: <Check className="w-12 h-12" />, empty: { title: 'A Blank Slate', desc: 'Movies and shows you complete will be tracked here.' } },
    { id: 'watchlist', label: 'Watchlist', items: watchlistFiltered, icon: <List className="w-12 h-12" />, empty: { title: 'Your Watchlist is Empty', desc: 'Add movies and shows you want to watch later.' } },
  ];
  
  const activeItems = tabs.find(tab => tab.id === activeTab)?.items || [];
  const activeTabInfo = tabs.find(tab => tab.id === activeTab)!;

  return (
    <>
      <div className="flex justify-center min-h-full">
        <div className="w-full max-w-lg">
          <header className="p-4 pt-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col gap-4">
            <h1 className="text-3xl font-headline font-bold text-center">My Lists</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter your lists..." 
                className="pl-10" 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </header>
          
          <nav className="flex justify-around items-center h-12 border-b border-border px-4 sticky top-[136px] bg-background/80 backdrop-blur-sm z-10">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                label={tab.label}
                count={tab.items.length}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>

          <ScrollArea className="h-[calc(100vh-136px-48px-64px)]">
            <div className="p-4 pb-24">
              <AnimatePresence mode="wait">
                {activeItems.length > 0 ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <AnimatePresence>
                      {activeItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <WatchingCard 
                            item={item} 
                            layout="horizontal" 
                            onClick={() => handleItemClick(item)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                     key={`${activeTab}-empty`}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.3 }}
                  >
                    <EmptyState
                      icon={activeTabInfo.icon}
                      title={activeTabInfo.empty.title}
                      description={activeTabInfo.empty.desc}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
          </ScrollArea>
        </div>
      </div>
      <UpdateProgressModal />
    </>
  );
}

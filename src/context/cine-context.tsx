
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { CineItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { mockCineData } from '@/lib/mock-data';

interface CineContextType {
  items: CineItem[];
  addItem: (item: CineItem) => Promise<void>;
  updateItem: (id: string, data: Partial<CineItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  updateModalOpen: boolean;
  setUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedItem: CineItem | null;
  setSelectedItem: Dispatch<SetStateAction<CineItem | null>>;
  fabAction: boolean;
  setFabAction: Dispatch<SetStateAction<boolean>>;
}

const CineContext = createContext<CineContextType | undefined>(undefined);

const COLLECTION_NAME = 'cineItems';

export function CineProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [items, setItems] = useState<CineItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CineItem | null>(null);
  const [fabAction, setFabAction] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTION_NAME), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as CineItem));
        
        if (data.length === 0 && process.env.NODE_ENV !== 'production') {
          console.log("Firestore is empty, seeding with mock data...");
          const batch = writeBatch(db);
          mockCineData.forEach((item) => {
            const docRef = doc(db, COLLECTION_NAME, item.id);
            batch.set(docRef, item);
          });
          batch.commit().then(() => console.log("Mock data seeded."));
        } else {
          setItems(data);
        }
      },
      (error) => {
        console.error("Error fetching Firestore collection: ", error);
        toast({ title: "Error", description: "Could not connect to the database.", variant: "destructive" });
      }
    );
    
    return () => unsubscribe();
  }, [toast]);

  const addItem = async (item: CineItem) => {
    try {
      await setDoc(doc(db, COLLECTION_NAME, item.id), item, { merge: true });
      toast({ title: "Success", description: `${item.title} has been added.` });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ title: "Error", description: "Could not add the item.", variant: "destructive" });
    }
  };

  const updateItem = async (id: string, data: Partial<CineItem>) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), data);
      toast({ title: "Updated", description: "Item has been updated successfully." });
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({ title: "Error", description: "Could not update the item.", variant: "destructive" });
    }
  };
  
  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      toast({ title: "Deleted", description: "Item has been removed." });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({ title: "Error", description: "Could not delete the item.", variant: "destructive" });
    }
  };

  const contextValue: CineContextType = {
    items,
    addItem,
    updateItem,
    deleteItem,
    modalOpen,
    setModalOpen,
    updateModalOpen,
    setUpdateModalOpen,
    selectedItem,
    setSelectedItem,
    fabAction,
    setFabAction
  };

  return (
    <CineContext.Provider value={contextValue}>
      {children}
    </CineContext.Provider>
  );
}

export function useCine() {
  const context = useContext(CineContext);
  if (context === undefined) {
    throw new Error('useCine must be used within a CineProvider');
  }
  return context;
}

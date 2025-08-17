
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, Timestamp, query, where, addDoc } from 'firebase/firestore';
import type { CineItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

interface CineContextType {
  items: CineItem[];
  addItem: (item: Omit<CineItem, 'id' | 'createdAt'>) => Promise<CineItem | null>;
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

const COLLECTION_NAME = 'media';
const USERS_COLLECTION = 'users';

export function CineProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<CineItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CineItem | null>(null);
  const [fabAction, setFabAction] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const userMediaCollection = collection(db, USERS_COLLECTION, user.uid, COLLECTION_NAME);
    
    const unsubscribe = onSnapshot(userMediaCollection, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CineItem));
        setItems(data);
      },
      (error) => {
        console.error("Error fetching user's media collection: ", error);
        toast({ title: "Error", description: "Could not connect to the database.", variant: "destructive" });
      }
    );
    
    return () => unsubscribe();
  }, [user, toast]);

  const addItem = async (item: Omit<CineItem, 'id' | 'createdAt'>): Promise<CineItem | null> => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add items.", variant: "destructive" });
      return null;
    }

    try {
      const userMediaCollection = collection(db, USERS_COLLECTION, user.uid, COLLECTION_NAME);
      const newItemData = {
        ...item,
        createdAt: Timestamp.now().toMillis().toString(),
      };
      const docRef = await addDoc(userMediaCollection, newItemData);
      return { id: docRef.id, ...newItemData };
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ title: "Error", description: "Could not add the item.", variant: "destructive" });
      return null;
    }
  };


  const updateItem = async (id: string, data: Partial<CineItem>) => {
     if (!user) {
      toast({ title: "Error", description: "You must be logged in to update items.", variant: "destructive" });
      return;
    }
    try {
      const itemRef = doc(db, USERS_COLLECTION, user.uid, COLLECTION_NAME, id);
      await updateDoc(itemRef, data);
      toast({ title: "Updated", description: "Item has been updated successfully." });
    } catch (error)
 {
      console.error("Error updating document: ", error);
      toast({ title: "Error", description: "Could not update the item.", variant: "destructive" });
    }
  };
  
  const deleteItem = async (id: string) => {
     if (!user) {
      toast({ title: "Error", description: "You must be logged in to delete items.", variant: "destructive" });
      return;
    }
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, user.uid, COLLECTION_NAME, id));
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

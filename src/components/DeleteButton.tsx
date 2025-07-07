"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  itemName: string;
  onDeleted: (id: string) => void;
}

export default function DeleteButton({ id, endpoint, itemName, onDeleted }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${itemName}`);
      }

      onDeleted(id);
      setIsOpen(false);
    } catch (error) {
      alert(`Erro ao excluir ${itemName}`);
      console.log(error)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-500 transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-[#080808] border-white/30 text-white rounded-[8px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Tem certeza que deseja excluir este {itemName}? Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-transparent border-white/20 text-white hover:bg-black hover:text-white rounded-[8px]"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-800 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              <>
                Excluir
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
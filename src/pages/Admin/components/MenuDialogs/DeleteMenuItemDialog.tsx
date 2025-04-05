
import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMenuItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  onItemDeleted: (itemId: string) => void;
}

export function DeleteMenuItemDialog({
  isOpen,
  setIsOpen,
  selectedItem,
  onItemDeleted,
}: DeleteMenuItemDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", selectedItem.id);
      
      if (error) throw error;
      
      onItemDeleted(selectedItem.id);
      setIsOpen(false);
      toast({
        title: "Menu item deleted",
        description: "The item has been removed from the menu",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteItem}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Delete Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

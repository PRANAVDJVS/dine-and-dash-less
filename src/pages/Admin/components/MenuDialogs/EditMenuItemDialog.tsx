
import { useState } from "react";
import { Loader2, Save, IndianRupee, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface EditMenuItemDialogProps {
  categories: MenuCategory[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: MenuItem | null;
  formData: {
    name: string;
    price: string;
    description: string;
    category_id: string;
    vegetarian: boolean;
    spicy: boolean;
    popular: boolean;
    image: string;
  };
  setFormData: (formData: {
    name: string;
    price: string;
    description: string;
    category_id: string;
    vegetarian: boolean;
    spicy: boolean;
    popular: boolean;
    image: string;
  }) => void;
  onItemUpdated: (item: MenuItem) => void;
}

export function EditMenuItemDialog({
  categories,
  isOpen,
  setIsOpen,
  selectedItem,
  formData,
  setFormData,
  onItemUpdated,
}: EditMenuItemDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    setIsSaving(true);
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        throw new Error("Invalid price");
      }

      const { data, error } = await supabase
        .from("menu_items")
        .update({
          name: formData.name,
          price,
          description: formData.description || null,
          category_id: formData.category_id,
          vegetarian: formData.vegetarian,
          spicy: formData.spicy,
          popular: formData.popular,
          image: formData.image || null,
        })
        .eq("id", selectedItem.id)
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        onItemUpdated(data[0]);
        setIsOpen(false);
        toast({
          title: "Menu item updated",
          description: "The item has been updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item",
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
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details of this menu item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Item name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="pl-9"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Item description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="http://example.com/image.jpg"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter the URL of an image for this item
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Attributes</label>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Vegetarian</span>
              <Switch
                checked={formData.vegetarian}
                onCheckedChange={(checked) => setFormData({ ...formData, vegetarian: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Spicy</span>
              <Switch
                checked={formData.spicy}
                onCheckedChange={(checked) => setFormData({ ...formData, spicy: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Popular</span>
              <Switch
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateItem}
            disabled={!formData.name || !formData.price || !formData.category_id || isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Update Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

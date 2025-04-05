
import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuCategory } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AddMenuItemDialog } from "./MenuDialogs/AddMenuItemDialog";
import { EditMenuItemDialog } from "./MenuDialogs/EditMenuItemDialog";
import { DeleteMenuItemDialog } from "./MenuDialogs/DeleteMenuItemDialog";
import { MenuTable } from "./MenuTable/MenuTable";
import { SearchBar } from "./MenuTable/SearchBar";

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    vegetarian: false,
    spicy: false,
    popular: false,
    image: "",
  });
  const { toast } = useToast();

  // Fetch menu items and categories
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from("menu_items")
          .select("*")
          .order("name");
        
        if (menuError) throw menuError;
        
        // Fetch categories
        const { data: categoryData, error: categoryError } = await supabase
          .from("menu_categories")
          .select("*")
          .order("name");
        
        if (categoryError) throw categoryError;
        
        setMenuItems(menuData || []);
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category_id: "",
      vegetarian: false,
      spicy: false,
      popular: false,
      image: "",
    });
    setSelectedItem(null);
  };

  const handleAddItem = (item: MenuItem) => {
    setMenuItems([item, ...menuItems]);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setMenuItems(
      menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    resetForm();
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
    setSelectedItem(null);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || "",
      category_id: item.category_id,
      vegetarian: item.vegetarian || false,
      spicy: item.spicy || false,
      popular: item.popular || false,
      image: item.image || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Menu Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>
      
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search menu items..."
      />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMenuItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No menu items found</p>
        </div>
      ) : (
        <MenuTable
          menuItems={filteredMenuItems}
          categories={categories}
          onEditItem={openEditDialog}
          onDeleteItem={openDeleteDialog}
        />
      )}

      {/* Dialogs */}
      <AddMenuItemDialog
        categories={categories}
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onItemAdded={handleAddItem}
      />
      
      <EditMenuItemDialog
        categories={categories}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedItem={selectedItem}
        formData={formData}
        setFormData={setFormData}
        onItemUpdated={handleUpdateItem}
      />

      <DeleteMenuItemDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        selectedItem={selectedItem}
        onItemDeleted={handleDeleteItem}
      />
    </div>
  );
}

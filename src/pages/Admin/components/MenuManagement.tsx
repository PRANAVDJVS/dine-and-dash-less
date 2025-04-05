
import { useState, useEffect } from "react";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Loader2,
  X,
  Check,
  ImageIcon,
  Save
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuCategory } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
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

  // Add a new menu item
  const handleAddItem = async () => {
    setIsSaving(true);
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        throw new Error("Invalid price");
      }

      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: formData.name,
          price,
          description: formData.description || null,
          category_id: formData.category_id,
          vegetarian: formData.vegetarian,
          spicy: formData.spicy,
          popular: formData.popular,
          image: formData.image || null,
        })
        .select();
      
      if (error) throw error;
      
      setMenuItems([...(data || []), ...menuItems]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Menu item added",
        description: "The item has been added to the menu",
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update a menu item
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
      
      setMenuItems(
        menuItems.map((item) => (item.id === selectedItem.id ? data[0] : item))
      );
      
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Menu item updated",
        description: "The item has been updated successfully",
      });
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

  // Delete a menu item
  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", selectedItem.id);
      
      if (error) throw error;
      
      setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Menu Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu items..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMenuItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No menu items found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.name}
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    )}
                  </TableCell>
                  <TableCell>{getCategoryName(item.category_id)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {parseFloat(item.price.toString()).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {item.vegetarian && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Veg
                        </Badge>
                      )}
                      {item.spicy && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Spicy
                        </Badge>
                      )}
                      {item.popular && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && setIsAddDialogOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Add a new item to your restaurant menu.
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddItem}
              disabled={!formData.name || !formData.price || !formData.category_id || isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && setIsEditDialogOpen(false)}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
    </div>
  );
}

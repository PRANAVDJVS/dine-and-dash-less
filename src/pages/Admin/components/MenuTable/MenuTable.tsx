
import { Pencil, Trash2, IndianRupee } from "lucide-react";
import { MenuItem, MenuCategory } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MenuTableProps {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

export function MenuTable({
  menuItems,
  categories,
  onEditItem,
  onDeleteItem,
}: MenuTableProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
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
          {menuItems.map((item) => (
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
                    onClick={() => onEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => onDeleteItem(item)}
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
  );
}

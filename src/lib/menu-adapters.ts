
import { MenuItem as LibMenuItem } from "@/lib/menu-data";
import { MenuItem as DatabaseMenuItem } from "@/types/database";
import { v4 as uuidv4 } from 'uuid';

// Map of string IDs to generated UUIDs to ensure consistency
const idMapping: Record<string, string> = {};

// Function to get a consistent UUID for a string ID
function getConsistentUuid(stringId: string): string {
  if (!idMapping[stringId]) {
    // Generate a new UUID for this string ID
    idMapping[stringId] = uuidv4();
  }
  return idMapping[stringId];
}

// Adapts menu items from the static data to database format
export function adaptMenuItemToDatabase(item: LibMenuItem): DatabaseMenuItem {
  // Check if the item.id is already a valid UUID
  const isValidUuid = typeof item.id === 'string' && 
    item.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  
  // If it's a valid UUID, use it; otherwise, generate a consistent UUID
  const id = isValidUuid ? item.id : getConsistentUuid(item.id);
  
  return {
    id,
    name: item.name,
    description: item.description || null,
    price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
    image: item.image || null,
    category_id: item.category || '00000000-0000-0000-0000-000000000000', // Map category to category_id
    vegetarian: item.vegetarian || false,
    spicy: item.spicy || false,
    popular: item.popular || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

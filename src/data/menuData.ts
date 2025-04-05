
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "app-1",
    name: "Bruschetta",
    price: 8.99,
    description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
    category: "appetizers"
  },
  {
    id: "app-2",
    name: "Mozzarella Sticks",
    price: 7.99,
    description: "Breaded mozzarella served with marinara sauce",
    category: "appetizers"
  },
  {
    id: "app-3",
    name: "Garlic Bread",
    price: 5.99,
    description: "Toasted bread with garlic butter and herbs",
    category: "appetizers"
  },
  
  // Main Courses
  {
    id: "main-1",
    name: "Spaghetti Bolognese",
    price: 14.99,
    description: "Classic pasta with rich meat sauce and parmesan",
    category: "mains"
  },
  {
    id: "main-2",
    name: "Grilled Salmon",
    price: 18.99,
    description: "Fresh salmon with lemon butter sauce and seasonal vegetables",
    category: "mains"
  },
  {
    id: "main-3",
    name: "Chicken Alfredo",
    price: 16.99,
    description: "Fettuccine pasta with creamy sauce and grilled chicken",
    category: "mains"
  },
  {
    id: "main-4",
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic pizza with tomatoes, mozzarella, and fresh basil",
    category: "mains"
  },
  
  // Desserts
  {
    id: "des-1",
    name: "Tiramisu",
    price: 6.99,
    description: "Coffee-flavored Italian dessert with mascarpone",
    category: "desserts"
  },
  {
    id: "des-2",
    name: "Chocolate Lava Cake",
    price: 7.99,
    description: "Warm chocolate cake with a molten chocolate center",
    category: "desserts"
  },
  
  // Beverages
  {
    id: "bev-1",
    name: "Soft Drink",
    price: 2.99,
    description: "Cola, lemon-lime, or orange soda",
    category: "beverages"
  },
  {
    id: "bev-2",
    name: "Iced Tea",
    price: 2.99,
    description: "Freshly brewed sweet or unsweetened tea",
    category: "beverages"
  },
  {
    id: "bev-3",
    name: "Coffee",
    price: 3.49,
    description: "Regular or decaf coffee",
    category: "beverages"
  }
];

export const menuCategories: MenuCategory[] = [
  {
    id: "cat-1",
    name: "Appetizers",
    items: menuItems.filter(item => item.category === "appetizers")
  },
  {
    id: "cat-2",
    name: "Main Courses",
    items: menuItems.filter(item => item.category === "mains")
  },
  {
    id: "cat-3",
    name: "Desserts",
    items: menuItems.filter(item => item.category === "desserts")
  },
  {
    id: "cat-4",
    name: "Beverages",
    items: menuItems.filter(item => item.category === "beverages")
  }
];

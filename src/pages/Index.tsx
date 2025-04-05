import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuItem, menuItems } from "@/lib/menu-data";
import { FoodCategory } from "@/components/ui/FoodCategory";
import { foodCategories } from "@/lib/food-categories";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { adaptMenuItemToDatabase } from "@/lib/menu-adapters";

export default function Index() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Get 4 popular items for showcase
  const popularItems = menuItems
    .filter((item) => item.popular)
    .slice(0, 4);
  
  const handleViewMenu = () => {
    navigate("/menu");
  };

  const handleAddToCart = async (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert menu-data MenuItem to database MenuItem with proper UUID
      const databaseItem = adaptMenuItemToDatabase(item);
      await addToCart(databaseItem, 1);
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "There was an error adding this item to your cart.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Background Image */}
        <section 
          className="relative pt-20 min-h-[90vh] flex items-center bg-cover bg-center" 
          style={{ 
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/f38bb9f8-a76d-4ed2-9fbc-41b2527a0913.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <Container className="relative z-10">
            <div className="max-w-xl mx-auto text-center">
              <MotionDiv animation="fade-in">
                <div className="mb-2">
                  <span className="tag bg-amber-600/30 text-amber-50 inline-block mb-4">
                    Authentic Indian Cuisine
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-tight mb-6 text-white">
                  Savor the <span className="relative">Authentic<span className="absolute -bottom-2 left-0 right-0 h-1 bg-amber-500 rounded-full"></span></span> Taste of India
                </h1>
                <p className="text-lg text-amber-50/90 mb-8 leading-relaxed">
                  Experience the perfect blend of tradition and innovation with our carefully crafted menu. Every dish tells a story of passion and dedication to Indian culinary arts.
                </p>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-full text-base bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleViewMenu}
                  >
                    Explore Menu
                  </Button>
                </div>
              </MotionDiv>
            </div>
          </Container>
        </section>
        
        {/* Food Categories Section */}
        <section className="py-12 bg-amber-50">
          <Container>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">What's on your mind?</h2>
              <p className="text-muted-foreground">Explore our diverse menu categories</p>
            </div>
            
            <div className="relative overflow-x-auto pb-4">
              <div className="flex gap-8 px-4 py-4 overflow-x-auto snap-x scrollbar-hide">
                {foodCategories.map((category) => (
                  <FoodCategory 
                    key={category.id}
                    name={category.name}
                    image={category.image}
                    onClick={() => navigate("/menu")}
                  />
                ))}
              </div>
              
              {/* Fade effect on sides */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-amber-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-amber-50 to-transparent pointer-events-none"></div>
            </div>
          </Container>
        </section>
        
        {/* Popular Items Section */}
        <section className="py-24">
          <Container>
            <div className="flex flex-wrap items-center justify-between mb-12">
              <MotionDiv animation="fade-in" className="max-w-lg mb-6 md:mb-0">
                <span className="tag bg-amber-100 text-amber-800 inline-block mb-4">
                  Customer Favorites
                </span>
                <h2 className="text-3xl md:text-4xl font-medium mb-4">
                  Our Most Popular Dishes
                </h2>
                <p className="text-muted-foreground">
                  Discover what our customers love the most. These dishes have earned their place as the stars of our menu.
                </p>
              </MotionDiv>
              
              <MotionDiv animation="fade-in" delay={200}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full group border-amber-300 hover:bg-amber-50"
                  onClick={handleViewMenu}
                >
                  View All Menu
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </MotionDiv>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item, index) => (
                <PopularItemCard
                  key={item.id}
                  item={{...item, price: item.price * 82}} // Converting to rupees (approx USD to INR)
                  delay={index * 100}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-amber-50 relative overflow-hidden">
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <MotionDiv animation="fade-in">
                <span className="tag bg-amber-100 text-amber-800 inline-block mb-4">
                  Taste the Tradition
                </span>
                <h2 className="text-3xl md:text-4xl font-medium mb-6">
                  Ready to Experience Our Culinary Delights?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Explore our menu and treat yourself to the authentic flavors of India. Each dish is prepared with care using traditional recipes and the finest ingredients.
                </p>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-full text-base bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleViewMenu}
                  >
                    Explore Our Menu
                  </Button>
                </div>
              </MotionDiv>
            </div>
          </Container>
          
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-amber-500"></div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-amber-500"></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

interface PopularItemCardProps {
  item: MenuItem;
  delay: number;
  onAddToCart: (e: React.MouseEvent, item: MenuItem) => void;
}

function PopularItemCard({ item, delay, onAddToCart }: PopularItemCardProps) {
  const navigate = useNavigate();
  
  return (
    <MotionDiv animation="slide-up" delay={delay}>
      <div className="card-hover group h-full flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden">
          <AnimatedImage
            src={item.image}
            alt={item.name}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{item.name}</h3>
            <div className="font-medium text-base ml-2 whitespace-nowrap">
              ₹{item.price.toFixed(0)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-auto flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full border-amber-300 hover:bg-amber-50"
              onClick={() => navigate("/menu")}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="text-xs rounded-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={(e) => onAddToCart(e, item)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

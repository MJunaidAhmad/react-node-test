import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getErrorMessage } from '../services/api';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { CheckCircle2, ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  featured: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await getProduct(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        throw new Error(response.message || 'Failed to load product');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load Product',
        description: errorMessage,
      });
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
      });
      return;
    }
    
    setAddingToCart(true);
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    
    toast({
      variant: 'success',
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 300);
  };

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  const itemInCart = isInCart(product._id);
  const cartQuantity = getCartItemQuantity(product._id);

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.imageUrl || `https://placehold.co/500x500/6366f1/ffffff?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/500x500/6366f1/ffffff?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <CardTitle className="text-3xl mb-2">{product.name}</CardTitle>
              <CardDescription className="text-lg mb-4">{product.category}</CardDescription>
              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div>
                <p className="text-4xl font-bold mb-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock} available
                </p>
                {itemInCart && (
                  <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {cartQuantity} {cartQuantity === 1 ? 'item' : 'items'} in cart
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {itemInCart ? (
                  <>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 w-full"
                      disabled
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Already in Cart ({cartQuantity})
                    </Button>
                    <Link to="/cart" className="w-full">
                      <Button variant="outline" size="lg" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                    className="w-full"
                  >
                    {addingToCart ? (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Adding...
                      </>
                    ) : product.stock === 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


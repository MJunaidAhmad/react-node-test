import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getErrorMessage } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load Products',
        description: errorMessage,
      });
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
      });
      return;
    }

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
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Browse our product catalog</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const itemInCart = isInCart(product._id);
          const cartQuantity = getCartItemQuantity(product._id);

          return (
            <Card key={product._id}>
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(product.name);
                    }}
                  />
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    {itemInCart && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {cartQuantity} in cart
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {itemInCart ? (
                      <>
                        <Button
                          variant="secondary"
                          className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                          disabled
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          In Cart
                        </Button>
                        <Link to={`/products/${product._id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                        <Link to={`/products/${product._id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


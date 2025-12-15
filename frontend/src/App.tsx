import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initializeDatabase, getErrorMessage } from './services/api';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { Button } from './components/ui/button';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-initialize on app start
    handleInitialize();
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitError(null);
    try {
      const response = await initializeDatabase();
      if (response.success) {
        setIsInitialized(true);
        toast({
          variant: 'success',
          title: 'Database Initialized',
          description: 'Application is ready to use.',
        });
      } else {
        throw new Error(response.message || 'Failed to initialize database');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setInitError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Initialization Failed',
        description: errorMessage,
      });
      console.error('❌ Failed to initialize database:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Eric Tech Assessment</h1>
          {isInitializing ? (
            <p className="text-muted-foreground">Initializing database...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">Database not initialized</p>
              {initError && (
                <p className="text-sm text-destructive mb-2">{initError}</p>
              )}
              <Button onClick={handleInitialize}>Initialize Database</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          </Routes>
        </Layout>
        <Toaster />
      </CartProvider>
    </Router>
  );
}

export default App;


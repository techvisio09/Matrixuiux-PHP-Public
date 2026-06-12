import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import InfoPage from "./pages/InfoPage";
import Disclaimer from "./pages/Disclaimer";
import Sitemap from "./pages/Sitemap";
import JivoChat from "./components/JivoChat";
import AuthCallback from "./components/AuthCallback";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CatalogProvider } from "./context/CatalogContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

// Ensures every navigation lands at the very top of the target page
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Detect Google auth callback synchronously during render (before any route runs)
const AppRouter = () => {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/page/:slug" element={<InfoPage />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/category/:slug" element={<InfoPage />} />
      </Routes>
      <JivoChat />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <CurrencyProvider>
          <CartProvider>
            <CatalogProvider>
              <BrowserRouter>
                <AuthProvider>
                  <AppRouter />
                </AuthProvider>
              </BrowserRouter>
              <Toaster />
            </CatalogProvider>
          </CartProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;

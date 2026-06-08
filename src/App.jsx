/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import RequireAuth from "./components/RequireAuth.jsx";
import PDP from "./pages/PDP";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Designer from "./pages/Designer";
import Templates from "./pages/Templates";
import InfoPage from "./pages/InfoPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import CareersPage from "./pages/CareersPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";

// Admin lives in its own standalone repo (pune-prints-admin) and talks to the
// same backend on a separate origin (localhost:3001 in dev).

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen pages (no nav/footer) */}
            <Route path="/login" element={<Login />} />
            {/* Sign-up is unified into the phone login flow. */}
            <Route path="/signup" element={<Navigate to="/login" replace />} />
            <Route path="/design" element={<Designer />} />

            {/* Site shell */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="business-cards" element={<PDP />} />
              <Route path="cart" element={<Cart />} />
              <Route path="templates" element={<Templates />} />
              {/* Premium purpose-built pages */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="help" element={<FAQPage />} />
              <Route path="order-status" element={<OrderStatusPage />} />
              {/* Authenticated account area (My Profile / Orders / Addresses…) */}
              <Route
                path="account/*"
                element={<RequireAuth><Account /></RequireAuth>}
              />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:idx" element={<BlogPostPage />} />
              {/* Simple admin-editable prose pages */}
              <Route path="shipping" element={<InfoPage slug="shipping" fallbackTitle="Shipping Info" />} />
              <Route path="returns" element={<InfoPage slug="returns" fallbackTitle="Returns" />} />
              <Route path="design-tips" element={<InfoPage slug="design-tips" fallbackTitle="Design Tips" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

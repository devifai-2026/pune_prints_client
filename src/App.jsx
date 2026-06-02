/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PDP from "./pages/PDP";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Designer from "./pages/Designer";

// Admin lives in its own standalone repo (pune-prints-admin) and talks to the
// same backend on a separate origin (localhost:3001 in dev).

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen pages (no nav/footer) */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/design" element={<Designer />} />

            {/* Site shell */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="business-cards" element={<PDP />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

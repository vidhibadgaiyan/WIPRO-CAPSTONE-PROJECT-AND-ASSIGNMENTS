// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 
import Header         from "./components/Header";
import Footer         from "./components/Footer";
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
 
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Menu           from "./pages/Menu";
import Cart           from "./pages/Cart";
import OrdersPage     from "./pages/OrdersPage";
import AdminMenu      from "./pages/AdminMenu";
import AdminOrders    from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import BillPage       from "./pages/BillPage";
 
import { getRole } from "./services/authService";
 
// Redirect / based on role
function HomeRedirect() {
  const role = getRole();
  if (role === "OWNER") return <Navigate to="/admin/dashboard" />;
  if (role === "USER")  return <Navigate to="/menu" />;
  return <Navigate to="/login" />;
}
 
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
 
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        {/* Root redirect */}
        <Route path="/" element={<HomeRedirect />} />
 
        {/* User routes */}
        <Route path="/menu"          element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders"        element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/bill/:orderId" element={<ProtectedRoute><BillPage /></ProtectedRoute>} />
 
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/menu"      element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />
        <Route path="/admin/orders"    element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      </Routes>
 
      <Footer />
    </BrowserRouter>
  );
}
 
export default App;
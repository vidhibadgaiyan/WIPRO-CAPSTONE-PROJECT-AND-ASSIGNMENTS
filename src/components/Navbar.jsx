// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { getToken, getRole, logout } from "../services/authService";
 
function Navbar() {
  const navigate = useNavigate();
  const token    = getToken();
  const role     = getRole();
 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-4">
      <span className="navbar-brand fw-bold">🍕 Pizza Store</span>
 
      <div className="d-flex gap-3 align-items-center ms-auto">
 
        {/* Not logged in */}
        {!token && (
          <>
            <Link className="nav-link text-white" to="/login">Login</Link>
            <Link className="nav-link text-white" to="/register">Register</Link>
          </>
        )}
 
        {/* User links */}
        {token && role === "USER" && (
          <>
            <Link className="nav-link text-white" to="/menu">Menu</Link>
            <Link className="nav-link text-white" to="/cart">Cart</Link>
            <Link className="nav-link text-white" to="/orders">My Orders</Link>
          </>
        )}
 
        {/* Owner/Admin links — Dashboard | Manage Menu | Orders */}
        {token && role === "OWNER" && (
          <>
            <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
            <Link className="nav-link text-white" to="/admin/menu">Manage Menu</Link>
            <Link className="nav-link text-white" to="/admin/orders">Orders</Link>
          </>
        )}
 
        {token && (
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
 
export default Navbar;
// src/pages/Cart.jsx
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../services/orderService";
import { getEmail } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCartEntirely, updateQuantity, clearCart } = useContext(CartContext);
  const [deliveryMode, setDeliveryMode] = useState("HOME");
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const email = getEmail();
    if (!email) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    const items = cart.map((i) => ({
      menuItemId: i.id,
      itemName:   i.name,
      price:      i.price,
      quantity:   i.quantity,
    }));
    try {
      await placeOrder({ deliveryMode, customerEmail: email, items });
      alert("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (err) {
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <a href="/menu">Browse the menu</a>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id}
              className="d-flex align-items-center justify-content-between border rounded p-3 mb-2">
              <div>
                <h6 className="mb-0">{item.name}</h6>
                <small className="text-muted">₹{item.price} each</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number" min="1"
                  value={item.quantity}
                  className="form-control form-control-sm"
                  style={{ width: "70px" }}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                />
                <span className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                {/* This uses removeFromCartEntirely — removes whole item from cart */}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromCartEntirely(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-3 mb-3">
            <label className="form-label fw-bold">Delivery Mode:</label>
            <select
              className="form-select"
              style={{ maxWidth: "250px" }}
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value)}
            >
              <option value="HOME">Home Delivery</option>
              <option value="PICKUP">Pickup</option>
            </select>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <h5>Total: <span className="text-danger">₹{totalPrice.toFixed(2)}</span></h5>
            <button className="btn btn-danger px-4" onClick={checkout}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
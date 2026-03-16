// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, getOrderItems } from "../services/orderService";
import { getEmail } from "../services/authService";

function OrdersPage() {
  const [orders,     setOrders]     = useState([]);
  const [orderItems, setOrderItems] = useState({});

  const loadOrders = async () => {
    const email = getEmail();
    if (!email) return;
    const res = await getMyOrders(email);
    const fetchedOrders = res.data || [];
    setOrders(fetchedOrders);
    const itemsMap = {};
    for (const order of fetchedOrders) {
      const itemRes = await getOrderItems(order.id);
      itemsMap[order.id] = itemRes.data || [];
    }
    setOrderItems(itemsMap);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel this order.");
    }
  };

  const handleShowBill = (orderId) => {
    window.open(`/bill/${orderId}`, "_blank");
  };

  const statusColor = (status) => {
    const map = {
      PENDING:"warning", PLACED:"info", PREPARING:"primary",
      OUT_FOR_DELIVERY:"secondary", DELIVERED:"success", CANCELLED:"danger",
    };
    return map[status] || "dark";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📦 My Orders</h2>

      {orders.length === 0 && (
        <div className="alert alert-info">No orders found.</div>
      )}

      {/* reversed so newest order appears at top */}
      {[...orders].reverse().map((order) => (
        <div key={order.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Order #{order.id}</h6>
              <span className={`badge bg-${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <p className="mb-1 text-muted small">
              <strong>Items: </strong>
              {(orderItems[order.id] || []).map((item, i) => (
                <span key={i}>
                  {item.itemName} x{item.quantity}
                  {i < orderItems[order.id].length - 1 ? ", " : ""}
                </span>
              ))}
            </p>

            <p className="mb-1"><strong>Total:</strong> ₹{order.totalPrice?.toFixed(2)}</p>
            <p className="mb-2"><strong>Delivery:</strong> {order.deliveryMode}</p>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleCancel(order.id)}
                disabled={order.status !== "PENDING"}
                title={order.status !== "PENDING" ? "Can only cancel PENDING orders" : ""}
              >
                Cancel Order
              </button>

              {order.billGenerated && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleShowBill(order.id)}
                >
                  Show Bill
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
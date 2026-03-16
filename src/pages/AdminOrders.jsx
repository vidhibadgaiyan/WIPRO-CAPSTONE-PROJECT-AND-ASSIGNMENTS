// src/pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import { getNotifications, updateOrderStatus, generateBill } from "../services/orderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await getNotifications();
    setOrders(res.data || []);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleGenerateBill = async (id) => {
    try {
      await generateBill(id);
      alert("Bill generated! User can now view their bill.");
      loadOrders();
    } catch (err) {
      alert("Failed to generate bill.");
    }
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
      <h2 className="mb-3">📋 Order Notifications</h2>

      {orders.length === 0 && (
        <div className="alert alert-info">No orders yet.</div>
      )}

      {/* reversed so newest order appears at top */}
      {[...orders].reverse().map((order) => (
        <div key={order.orderId} className="card mb-3 shadow-sm">
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Order #{order.orderId}</h6>
              <span className={`badge bg-${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <p className="mb-1"><strong>Customer:</strong> {order.customerEmail}</p>
            <p className="mb-1">
              <strong>Items:</strong> {order.itemsSummary?.join(", ") || "—"}
            </p>
            <p className="mb-1"><strong>Total:</strong> ₹{order.total?.toFixed(2)}</p>
            <p className="mb-2"><strong>Delivery:</strong> {order.deliveryMode}</p>

            {order.billGenerated && (
              <span className="badge bg-success mb-2">✅ Bill Generated</span>
            )}

            <div className="d-flex gap-3 flex-wrap align-items-center mt-2">
              <div>
                <label className="form-label mb-1 small fw-bold">Update Status:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "190px" }}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PLACED">PLACED</option>
                  <option value="PREPARING">PREPARING</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleGenerateBill(order.orderId)}
                  disabled={order.billGenerated}
                  title={order.billGenerated ? "Bill already generated" : ""}
                >
                  {order.billGenerated ? "Bill Sent ✓" : "Generate Bill"}
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
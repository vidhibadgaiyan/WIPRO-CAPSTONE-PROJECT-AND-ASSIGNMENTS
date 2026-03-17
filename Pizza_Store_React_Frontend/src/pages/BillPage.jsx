// src/pages/BillPage.jsx
// This page is opened in a new tab from OrdersPage when user clicks "Show Bill"
// Route: /bill/:orderId
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBill } from "../services/orderService";
 
function BillPage() {
  const { orderId } = useParams();
  const [bill,    setBill]    = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    getBill(orderId)
      .then((res) => {
        setBill(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load bill.");
        setLoading(false);
      });
  }, [orderId]);
 
  if (loading) return <div className="container mt-5"><p>Loading bill...</p></div>;
  if (error)   return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  if (!bill)   return <div className="container mt-5"><p>No bill data found.</p></div>;
 
  const deliveryCharge = 40;
  const subtotal       = bill.totalPrice;
  const gst            = subtotal * 0.18;
  const grandTotal     = subtotal + gst + deliveryCharge;
 
  return (
    <div className="container mt-4" style={{ maxWidth: "650px" }}>
      <div className="card shadow p-4">
        <div className="text-center mb-3">
          <h3>🍕 Pizza Store — Invoice</h3>
          <p className="text-muted mb-0">Order #{bill.orderId}</p>
          <p className="text-muted">
            Date: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>
 
        <hr />
 
        <p><strong>Customer:</strong> {bill.customerEmail}</p>
        <p><strong>Delivery Mode:</strong> {bill.deliveryMode}</p>
        <p><strong>Status:</strong> <span className="badge bg-success">{bill.status}</span></p>
 
        <hr />
 
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>₹{item.unitPrice?.toFixed(2)}</td>
                <td>₹{item.subtotal?.toFixed(2)}</td>
              </tr>
            ))}
 
            <tr>
              <td colSpan="4"><strong>Subtotal</strong></td>
              <td>₹{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4">GST (18%)</td>
              <td>₹{gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4">Delivery Charge</td>
              <td>₹{deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr className="table-warning">
              <td colSpan="4"><strong>Grand Total</strong></td>
              <td><strong>₹{grandTotal.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
 
        <div className="text-center mt-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
            🖨 Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default BillPage;
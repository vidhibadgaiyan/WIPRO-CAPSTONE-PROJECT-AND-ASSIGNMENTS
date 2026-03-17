// src/pages/RevenuePage.jsx
import { useEffect, useState } from "react";
import { getRevenue } from "../services/orderService";
 
function RevenuePage() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    getRevenue()
      .then((res) => {
        setRevenue(res.data);
        setLoading(false);
      })
      .catch(() => {
        setRevenue(0);
        setLoading(false);
      });
  }, []);
 
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card text-center shadow p-4">
        <h3 className="mb-3">💰 Total Revenue</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <h2 className="text-success">₹{revenue?.toFixed(2)}</h2>
        )}
        <p className="text-muted small mt-2">
          Calculated from all DELIVERED orders
        </p>
      </div>
    </div>
  );
}
 
export default RevenuePage;
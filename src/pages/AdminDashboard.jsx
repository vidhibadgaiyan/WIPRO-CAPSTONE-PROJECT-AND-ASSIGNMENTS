// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getOrders, getNotifications, getRevenue } from "../services/orderService";
 
const COLORS = ["#dc3545","#fd7e14","#ffc107","#20c997","#0dcaf0"];
 
const STATUS_COLOR = {
  PENDING:"warning", PLACED:"info", PREPARING:"primary",
  OUT_FOR_DELIVERY:"secondary", DELIVERED:"success", CANCELLED:"danger"
};
 
function StatCard({ title, value, icon, border }) {
  return (
    <div className="col">
      <div className={`card border-0 border-start border-4 border-${border} shadow-sm h-100`}>
        <div className="card-body d-flex align-items-center gap-3">
          <span style={{ fontSize: "2rem" }}>{icon}</span>
          <div>
            <div className="fs-4 fw-bold">{value}</div>
            <div className="text-muted small">{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function AdminDashboard() {
  const [orders,     setOrders]     = useState([]);
  const [revenue,    setRevenue]    = useState(0);
  const [topSellers, setTopSellers] = useState([]);
  const [loading,    setLoading]    = useState(true);
 
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });
 
  useEffect(() => {
    Promise.all([getOrders(), getRevenue(), getNotifications()])
      .then(([oRes, rRes, nRes]) => {
        const allOrders = oRes.data || [];
        setOrders(allOrders);
        setRevenue(rRes.data || 0);
 
        // Build top sellers from notification summaries
        const countMap = {};
        (nRes.data || []).forEach(n =>
          (n.itemsSummary || []).forEach(s => {
            const m = s.match(/^(.+)\s+x(\d+)$/);
            if (m) countMap[m[1].trim()] = (countMap[m[1].trim()] || 0) + parseInt(m[2]);
          })
        );
        setTopSellers(
          Object.entries(countMap).sort((a,b) => b[1]-a[1]).slice(0,5)
            .map(([name, count]) => ({ name, count }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
 
  // Stats
  const total     = orders.length;
  const pending   = orders.filter(o => o.status === "PENDING").length;
  const delivered = orders.filter(o => o.status === "DELIVERED").length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;
  const customers = new Set(orders.map(o => o.customerEmail)).size;
 
  // Last 7 days revenue
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const rev = orders
      .filter(o => o.status === "DELIVERED" && o.createdAt?.startsWith(key))
      .reduce((s, o) => s + o.totalPrice, 0);
    return { label: key.slice(5), rev };
  });
 
  const maxRev    = Math.max(...last7.map(d => d.rev), 1);
  const maxSeller = Math.max(...topSellers.map(t => t.count), 1);
  const W = 560, H = 160, PAD = 40;
 
  // SVG line chart points
  const pts = last7.map((d, i) => ({
    x: PAD + i * ((W - PAD) / 6),
    y: PAD + (1 - d.rev / maxRev) * (H - PAD),
    ...d
  }));
  const linePath = pts.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[6].x},${H} L${pts[0].x},${H}Z`;
 
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height:"60vh"}}>
      <div className="spinner-border text-danger"/>
    </div>
  );
 
  return (
    <div className="container-fluid px-4 py-4">
 
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Admin Dashboard</h4>
          <small className="text-muted">Pizza Store — Overview</small>
        </div>
        <span className="badge bg-danger px-3 py-2 fs-6">📅 {dateStr}</span>
      </div>
 
      {/* Stat Cards */}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4">
        <StatCard title="Total Orders"   value={total}     icon="📦" border="primary"/>
        <StatCard title="Pending"        value={pending}   icon="⏳" border="warning"/>
        <StatCard title="Delivered"      value={delivered} icon="✅" border="success"/>
        <StatCard title="Cancelled"      value={cancelled} icon="❌" border="danger"/>
        <StatCard title="Customers"      value={customers} icon="👥" border="info"/>
        <StatCard title="Revenue"        value={`₹${revenue.toFixed(0)}`} icon="💰" border="dark"/>
      </div>
 
      {/* Charts */}
      <div className="row g-4 mb-4">
 
        {/* Line Chart */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <h6 className="fw-bold mb-0">📈 Daily Revenue — Last 7 Days</h6>
              <small className="text-muted">From delivered orders</small>
            </div>
            <div className="card-body pt-2">
              <svg viewBox={`0 0 ${W} ${H+20}`} style={{width:"100%"}}>
                {/* Grid */}
                {[0,1,2,3].map(i => (
                  <line key={i} x1={PAD} y1={PAD+i*35} x2={W} y2={PAD+i*35}
                    stroke="#f0f0f0" strokeWidth="1"/>
                ))}
                {/* Area + Line */}
                <path d={areaPath} fill="rgba(220,53,69,0.07)"/>
                <path d={linePath} fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinejoin="round"/>
                {/* Points + Labels */}
                {pts.map((p,i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#dc3545"/>
                    {p.rev > 0 && (
                      <text x={p.x} y={p.y-8} textAnchor="middle" fontSize="9" fill="#dc3545" fontWeight="bold">
                        ₹{p.rev.toFixed(0)}
                      </text>
                    )}
                    <text x={p.x} y={H+16} textAnchor="middle" fontSize="10" fill="#888">{p.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
 
        {/* Bar Chart */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <h6 className="fw-bold mb-0">🏆 Top 5 Best Sellers</h6>
              <small className="text-muted">By total quantity ordered</small>
            </div>
            <div className="card-body">
              {topSellers.length === 0
                ? <p className="text-muted text-center mt-4">No data yet</p>
                : topSellers.map((item, i) => (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-semibold">{i+1}. {item.name}</small>
                      <small className="text-muted">{item.count} qty</small>
                    </div>
                    <div className="progress" style={{height:"18px", borderRadius:"6px"}}>
                      <div className="progress-bar fw-bold small"
                        style={{
                          width:`${Math.round(item.count/maxSeller*100)}%`,
                          backgroundColor: COLORS[i],
                          borderRadius:"6px"
                        }}>
                        {Math.round(item.count/maxSeller*100)}%
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
 
      {/* Recent Orders */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-white border-0">
          <h6 className="fw-bold mb-0">🕐 Recent Orders</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order ID</th><th>Customer</th>
                <th>Total</th><th>Delivery</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan="5" className="text-center text-muted py-4">No orders yet</td></tr>
                : [...orders].reverse().slice(0,5).map(o => (
                  <tr key={o.id}>
                    <td className="fw-bold text-danger">#{o.id}</td>
                    <td className="text-muted small">{o.customerEmail}</td>
                    <td className="fw-semibold">₹{o.totalPrice?.toFixed(2)}</td>
                    <td><small>{o.deliveryMode}</small></td>
                    <td>
                      <span className={`badge bg-${STATUS_COLOR[o.status]||"dark"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
 
    </div>
  );
}
 
export default AdminDashboard;
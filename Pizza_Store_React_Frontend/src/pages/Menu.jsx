// src/pages/Menu.jsx
import { useEffect, useState, useContext } from "react";
import { getMenu, getMenuFiltered } from "../services/menuService";
import { CartContext } from "../context/CartContext";
 
// Categories as required: Pizza (with Veg/NonVeg), Appetizers, Beverages
const CATEGORIES = ["All", "Pizza", "Appetizers", "Beverages"];
 
function Menu() {
  const [menu,        setMenu]        = useState([]);
  const [category,    setCategory]    = useState("All");
  const [subcategory, setSubcategory] = useState("");
 
  // localQty tracks frontend-only quantity changes (not yet in DB)
  // Key = item.id, Value = display quantity (DB qty - items in cart)
  const [localQty, setLocalQty] = useState({});
 
  const { addToCart, removeFromCart, cart } = useContext(CartContext);
 
  // Load menu whenever filter changes
  useEffect(() => {
    const fetchMenu = async () => {
      let res;
      if (category === "All") {
        res = await getMenu();
      } else if (category === "Pizza" && subcategory) {
        res = await getMenuFiltered("Pizza", subcategory);
      } else {
        res = await getMenuFiltered(category === "All" ? undefined : category);
      }
 
      const items = res.data || [];
      setMenu(items);
 
      // Reset localQty to DB quantity for fresh load
      const qtyMap = {};
      items.forEach((item) => {
        qtyMap[item.id] = item.quantity;
      });
      setLocalQty(qtyMap);
    };
 
    fetchMenu();
  }, [category, subcategory]);
 
  // When category changes away from Pizza, clear subcategory
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat !== "Pizza") setSubcategory("");
  };
 
  // Add: decrement display qty by 1, add to cart
  const handleAdd = (item) => {
    const currentQty = localQty[item.id] ?? item.quantity;
    if (currentQty === 0) {
      alert("Sorry, this item is out of stock!");
      return;
    }
    addToCart({ ...item });
    setLocalQty((prev) => ({ ...prev, [item.id]: currentQty - 1 }));
  };
 
  // Remove: increment display qty by 1, remove from cart
  const handleRemove = (item) => {
    const inCart = cart.find((c) => c.id === item.id);
    if (!inCart) return; // nothing to remove
    removeFromCart(item.id);
    setLocalQty((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? item.quantity) + 1,
    }));
  };
 
  return (
    <div className="container mt-4">
      <h2 className="mb-3">🍕 Pizza Menu</h2>
 
      {/* ── Browse by Category ── */}
      <div className="mb-3">
        <strong>Browse by Category:</strong>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${category === cat ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        {/* Subcategory filter — only shown when Pizza is selected */}
        {category === "Pizza" && (
          <div className="d-flex gap-2 mt-2">
            <button
              className={`btn btn-sm ${subcategory === "" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setSubcategory("")}
            >
              All Pizza
            </button>
            <button
              className={`btn btn-sm ${subcategory === "Veg" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setSubcategory("Veg")}
            >
              🥦 Veg
            </button>
            <button
              className={`btn btn-sm ${subcategory === "NonVeg" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setSubcategory("NonVeg")}
            >
              🍗 Non-Veg
            </button>
          </div>
        )}
      </div>
 
      {/* ── Menu Cards ── */}
      <div className="row">
        {menu.length === 0 && (
          <p className="text-muted">No items found for this category.</p>
        )}
 
        {menu.map((item) => {
          const displayQty = localQty[item.id] ?? item.quantity;
          const inCartItem = cart.find((c) => c.id === item.id);
 
          return (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted small">{item.description}</p>
                  <p className="mb-1">
                    <span className="badge bg-secondary">{item.category}</span>
                    {item.subcategory && (
                      <span className={`badge ms-1 ${item.subcategory === "Veg" ? "bg-success" : "bg-danger"}`}>
                        {item.subcategory}
                      </span>
                    )}
                  </p>
                  <p className="fw-bold text-danger">₹{item.price}</p>
 
                  {/* Available quantity — updates on Add/Remove (frontend only) */}
                  <p className="text-muted small mb-2">
                    Available: <strong>{displayQty}</strong>
                    {displayQty === 0 && (
                      <span className="text-danger ms-1">(Out of Stock)</span>
                    )}
                  </p>
 
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAdd(item)}
                      disabled={displayQty === 0}
                    >
                      + Add
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleRemove(item)}
                      disabled={!inCartItem}
                    >
                      − Remove
                    </button>
                  </div>
 
                  {inCartItem && (
                    <p className="text-success small mt-1 mb-0">
                      In cart: {inCartItem.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
export default Menu;
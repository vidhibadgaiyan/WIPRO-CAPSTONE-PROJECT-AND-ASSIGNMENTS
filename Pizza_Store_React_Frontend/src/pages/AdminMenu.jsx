// src/pages/AdminMenu.jsx
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from "../services/menuService";
 
const emptyForm = {
  name: "", description: "", price: "", category: "Pizza",
  subcategory: "", available: true, quantity: 0, image: "",
};
 
const validationSchema = Yup.object({
  name:        Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price:       Yup.number().min(1, "Price must be > 0").required("Price is required"),
  category:    Yup.string().required("Category is required"),
  quantity:    Yup.number().min(0, "Quantity cannot be negative").required(),
});
 
function AdminMenu() {
  const [menu,      setMenu]      = useState([]);
  const [editId,    setEditId]    = useState(null); // null = add mode, id = edit mode
 
  const loadMenu = async () => {
    const res = await getMenu();
    setMenu(res.data || []);
  };
 
  useEffect(() => { loadMenu(); }, []);
 
  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, price: Number(values.price), quantity: Number(values.quantity) };
        if (editId) {
          await updateMenuItem(editId, payload);
          alert("Pizza updated!");
        } else {
          await addMenuItem(payload);
          alert("Pizza added!");
        }
        resetForm();
        setEditId(null);
        loadMenu();
      } catch (err) {
        alert("Operation failed. Check all fields.");
      }
    },
  });
 
  const handleEdit = (item) => {
    setEditId(item.id);
    formik.setValues({
      name:        item.name,
      description: item.description,
      price:       item.price,
      category:    item.category,
      subcategory: item.subcategory || "",
      available:   item.available,
      quantity:    item.quantity,
      image:       item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteMenuItem(id);
    loadMenu();
  };
 
  const handleCancel = () => {
    formik.resetForm();
    setEditId(null);
  };
 
  const field = (name, placeholder, type = "text") => (
    <div className="mb-2">
      <input
        className={`form-control ${formik.touched[name] && formik.errors[name] ? "is-invalid" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback">{formik.errors[name]}</div>
      )}
    </div>
  );
 
  return (
    <div className="container mt-4">
      <h2 className="mb-3">🍕 Manage Menu</h2>
 
      {/* ── Add / Edit Form ── */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>{editId ? "✏️ Edit Pizza" : "➕ Add New Pizza"}</h5>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-6">{field("name",        "Pizza Name")}</div>
            <div className="col-md-6">{field("description", "Description")}</div>
            <div className="col-md-4">{field("price",       "Price (₹)", "number")}</div>
            <div className="col-md-4">{field("quantity",    "Stock Quantity", "number")}</div>
            <div className="col-md-4">{field("image",       "Image URL")}</div>
 
            {/* Category dropdown */}
            <div className="col-md-4 mb-2">
              <select
                className="form-select"
                name="category"
                {...formik.getFieldProps("category")}
              >
                <option value="Pizza">Pizza</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
 
            {/* Subcategory — only shown for Pizza */}
            {formik.values.category === "Pizza" && (
              <div className="col-md-4 mb-2">
                <select
                  className="form-select"
                  name="subcategory"
                  {...formik.getFieldProps("subcategory")}
                >
                  <option value="">Select Type</option>
                  <option value="Veg">Veg</option>
                  <option value="NonVeg">Non-Veg</option>
                </select>
              </div>
            )}
 
            {/* Available toggle */}
            <div className="col-md-4 mb-2">
              <select
                className="form-select"
                name="available"
                value={formik.values.available}
                onChange={(e) => formik.setFieldValue("available", e.target.value === "true")}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
 
          <div className="d-flex gap-2">
            <button className="btn btn-danger" type="submit">
              {editId ? "Update Pizza" : "Add Pizza"}
            </button>
            {editId && (
              <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
 
      {/* ── Menu Items List ── */}
      <div className="row">
        {menu.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm">
              {item.image && (
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h6 className="card-title">{item.name}</h6>
                <p className="text-muted small mb-1">{item.description}</p>
                <p className="mb-1">
                  <span className="badge bg-secondary">{item.category}</span>
                  {item.subcategory && (
                    <span className={`badge ms-1 ${item.subcategory === "Veg" ? "bg-success" : "bg-danger"}`}>
                      {item.subcategory}
                    </span>
                  )}
                </p>
                <p className="fw-bold text-danger mb-1">₹{item.price}</p>
                <p className="small mb-2">Stock: <strong>{item.quantity}</strong></p>
 
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export default AdminMenu;
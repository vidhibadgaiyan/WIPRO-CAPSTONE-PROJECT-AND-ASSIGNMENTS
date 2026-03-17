// src/pages/Register.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
 
const validationSchema = Yup.object({
  name:     Yup.string().required("Name is required"),
  email:    Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role:     Yup.string().required("Role is required"),
});
 
function Register() {
  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "USER" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await register(values);
        alert("Registration successful! Please login.");
        navigate("/login");
      } catch (err) {
        setStatus("Registration failed. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });
 
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h3 className="mb-3 text-center">Register</h3>
 
        {formik.status && <div className="alert alert-danger">{formik.status}</div>}
 
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <input
              className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
              type="text"
              name="name"
              placeholder="Full Name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>
 
          <div className="mb-3">
            <input
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              type="email"
              name="email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>
 
          <div className="mb-3">
            <input
              className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
              type="password"
              name="password"
              placeholder="Password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>
 
          <div className="mb-3">
            <select
              className="form-select"
              name="role"
              {...formik.getFieldProps("role")}
            >
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
 
          <button
            className="btn btn-danger w-100"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
 
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
 
export default Register;
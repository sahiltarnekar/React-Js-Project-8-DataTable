import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import placeholder from "../assets/images/placeholder.svg";
import { MdGridView, MdTableRows } from "react-icons/md";

import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [single, setSingle] = useState({});
  const [sorting, setSorting] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("cards"); // cards | table
  const [limit, setLimit] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Fetch All Products
  async function fetchData() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/Products`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch products");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Delete Product
  async function trashProduct(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/Products/${id}`);
        setProduct(product.filter((p) => p.id !== id));
        toast.error("Product Deleted!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
          transition: Bounce,
        });
      }
    });
  }

  // Fetch Single Product for Edit
  async function SingleProduct(id) {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/Products/${id}`);
    setSingle(res.data);
    reset(res.data);
  }

  // Update Product
  async function editProduct(data) {
    if (!single || !single.id) {
      toast.error("No product selected");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/Products/${single.id}`, data);
      toast.success("Product Updated!");
      window.location.reload();
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    }
  }

  // Add Product
  const handleAddProductClick = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Add New Product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add!",
    }).then((result) => {
      if (result.isConfirmed) navigate("/addProduct");
    });
  };

  // Filter + Search
  const filteredProducts = product
    .filter((p) => 
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.price.toString().includes(search)
    )
    .sort((a, b) => {
      if (sorting === "asc") return a.product_name.localeCompare(b.product_name);
      if (sorting === "desc") return b.product_name.localeCompare(a.product_name);
      return 0;
    });

  const limitedProducts = limit === "all" ? filteredProducts : filteredProducts.slice(0, limit);

  return (
    <>
      <Header />

      <div className="container-fluid px-3 px-md-4 px-lg-5 mt-4 mb-5">
        <h1 className="text-center mb-4 gradient-text">Our Products</h1>

        {/* TOP BAR - Enhanced Responsive Layout */}
        <div className="row g-3 mb-4 align-items-center">
          {/* Total Products Counter */}
          <div className="col-12 col-md-auto">
            <p className="mb-0 fw-bold text-center text-md-start">
              Total Products: <span className="text-primary">{product.length}</span>
            </p>
          </div>

          {/* Controls Section */}
          <div className="col-12 col-md">
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-end align-items-stretch align-items-sm-center">
              
              {/* Search Input */}
              <div className="flex-fill">
                <input
                  type="text"
                  placeholder="Search name / price"
                  className="form-control"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Sorting Dropdown */}
              <div className="flex-shrink-0">
                <select
                  className="form-select"
                  style={{ minWidth: "120px" }}
                  onChange={(e) => setSorting(e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="asc">A - Z</option>
                  <option value="desc">Z - A</option>
                </select>
              </div>

              {/* Limit Dropdown */}
              <div className="flex-shrink-0 position-relative">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Show: {limit === "all" ? "All" : limit} ▼
                </button>
                {dropdownOpen && (
                  <div className="border bg-white shadow p-2 rounded position-absolute w-100" style={{ zIndex: 10, top: "100%", left: 0 }}>
                    {[10, 20, 30].map((num) => (
                      <div 
                        key={num} 
                        className="dropdown-item p-2 cursor-pointer"
                        onClick={() => { setLimit(num); setDropdownOpen(false); }}
                      >
                        {num}
                      </div>
                    ))}
                    <div 
                      className="dropdown-item p-2 cursor-pointer"
                      onClick={() => { setLimit("all"); setDropdownOpen(false); }}
                    >
                      All
                    </div>
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="btn-group flex-shrink-0">
                <button 
                  className={`btn ${view === "cards" ? "btn-primary" : "btn-outline-primary"}`} 
                  onClick={() => setView("cards")}
                >
                  <MdGridView size={18} />
                </button>
                <button 
                  className={`btn ${view === "table" ? "btn-primary" : "btn-outline-primary"}`} 
                  onClick={() => setView("table")}
                >
                  <MdTableRows size={18} />
                </button>
              </div>

              {/* Add Product Button */}
              <div className="flex-shrink-0">
                <button className="btn btn-primary w-100" onClick={handleAddProductClick}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD VIEW - Enhanced Responsive Grid */}
        {view === "cards" && (
          <div className="row g-3 g-md-4">
            {limitedProducts.map((ele) => (
              <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={ele.id}>
                <div className="card shadow-sm h-100 modern-card border-0">
                  <div className="ratio ratio-4x3">
                    <img
                      src={ele.image || placeholder}
                      alt={ele.product_name}
                      className="card-img-top object-fit-cover"
                      onError={(e) => { e.target.src = placeholder; }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="card-title mb-1 text-truncate">{ele.product_name}</h6>
                    <p className="text-muted small mb-2">{ele.category}</p>
                    <p className="fw-bold text-primary mb-2">${ele.price}</p>
                    <p className="text-muted small mb-3">
                      Date: {ele.upload_date ? new Date(ele.upload_date).toLocaleDateString() : "N/A"}
                    </p>
                    <div className="mt-auto d-grid gap-1">
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          className="btn btn-outline-primary flex-fill" 
                          onClick={() => navigate(`/single-product/${ele.id}`)}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-outline-warning flex-fill" 
                          onClick={() => navigate(`/addProduct/${ele.id}`)}
                        >
                          Update
                        </button>
                        <button 
                          className="btn btn-outline-danger flex-fill" 
                          onClick={() => trashProduct(ele.id)}
                        >
                          Delete
                        </button>
                        <button 
                          className="btn btn-outline-info flex-fill" 
                          data-bs-toggle="modal" 
                          data-bs-target="#exampleModal" 
                          onClick={() => SingleProduct(ele.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TABLE VIEW - Enhanced Responsive Table */}
        {view === "table" && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark ">
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">Image</th>
                  <th width="20%">Name</th>
                  <th width="15%">Category</th>
                  <th width="10%">Price</th>
                  <th width="15%">Date</th>
                  <th width="20%">Action</th>
                </tr>
              </thead>
              <tbody>
                {limitedProducts.map((ele, index) => (
                  <tr key={ele.id}>
                    <td className="fw-bold">{index + 1}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <img
                          src={ele.image || placeholder}
                          alt={ele.product_name}
                          className="rounded"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" title={ele.product_name}>
                        {ele.product_name}
                      </div>
                    </td>
                    <td>{ele.category}</td>
                    <td className="fw-bold text-success">${ele.price}</td>
                    <td className="small">
                      {ele.upload_date ? new Date(ele.upload_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        <button 
                          className="btn btn-primary btn-sm flex-fill" 
                          style={{ minWidth: "60px" }}
                          onClick={() => navigate(`/single-product/${ele.id}`)}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-warning btn-sm flex-fill text-white"
                          style={{ minWidth: "75px" }}
                          onClick={() => navigate(`/addProduct/${ele.id}`)}
                        >
                          Update
                        </button>
                        <button 
                          className="btn btn-danger btn-sm flex-fill"
                          style={{ minWidth: "70px" }}
                          onClick={() => trashProduct(ele.id)}
                        >
                          Delete
                        </button>
                        <button 
                          className="btn btn-info btn-sm flex-fill text-white"
                          style={{ minWidth: "60px" }}
                          data-bs-toggle="modal" 
                          data-bs-target="#exampleModal" 
                          onClick={() => SingleProduct(ele.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Products Message */}
        {limitedProducts.length === 0 && (
          <div className="text-center py-5">
            <div className="display-1 text-muted">📦</div>
            <h4 className="text-muted mt-3">No products found</h4>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* EDIT MODAL */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" data-bs-backdrop="static">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(editProduct)}>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input className="form-control" {...register("image")} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input className="form-control" {...register("product_name")} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" {...register("price")} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" {...register("description")} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
      <ToastContainer theme="dark" transition={Bounce} />
    </>
  );
};

export default Home;
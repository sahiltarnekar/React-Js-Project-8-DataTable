import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import placeholder from '../assets/images/placeholder.svg';

const SingleProduct = () => {
  const { id } = useParams();
  const [single, setSingle] = useState({});

  async function fetchProduct() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/Products/${id}`);
      setSingle(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="glass-effect p-4 rounded-3 modern-single-card">
        <Link to='/' className="text-decoration-none mb-3 d-inline-block">
          <button className='btn btn-outline-primary mb-4 pulse-animation'>
            <IoArrowBack className="me-2" /> Back to Products
          </button>
        </Link>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="modern-card p-3 rounded-3">
              <img
                src={single.image || placeholder}
                alt={single.product_name || 'Product Image'}
                className="img-fluid rounded-3 single-product-img"
                onError={(e) => { e.target.src = placeholder; }}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-7">
            <div className="modern-card p-4 rounded-3 h-100">
              <h1 className="gradient-text mb-4">{single.product_name}</h1>
              <div className="mb-4">
                <span className="badge bg-secondary fs-6 px-3 py-2">{single.category}</span>
              </div>
              <div className="mb-4">
                <span className="fs-2 fw-bold text-primary">${single.price}</span>
              </div>
              <div className="mb-5">
                <h5 className="text-muted mb-3">Description</h5>
                <p className="fs-5 text-secondary">{single.description}</p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button className='btn btn-primary btn-lg pulse-animation px-4'>Buy Now</button>
                <button className='btn btn-outline-secondary btn-lg px-4'>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

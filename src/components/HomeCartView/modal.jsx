import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./style.css"; // Ensure this file exists for loader styles

const CheckoutDetailsModal = ({ show, onHide, onPay, isPaystackLoading, setIsPaystackLoading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (formData.fullName && formData.phone && formData.email && formData.address) {
      onPay(formData); // Trigger handlePay in HomeCartView
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enter Your Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isPaystackLoading && (
          <div className="loader-overlay">
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Processing payment with Paystack...</p>
            </div>
          </div>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isPaystackLoading}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isPaystackLoading}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPaystackLoading}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Home Address</Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isPaystackLoading}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPaystackLoading}
            className="w-100"
          >
            Pay Now
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckoutDetailsModal;
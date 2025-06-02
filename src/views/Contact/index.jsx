// src/components/ContactForm.jsx
import React, { useState } from "react";
import Banner1 from "../../assets/images/contact.png";


const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("https://formspree.io/f/mqabzbez", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setStatus("Thank you! Your message has been sent.");
        setFormState({ name: "", email: "", message: "" });
      } else {
        setStatus("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Formspree submission error:", error);
      setStatus("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
          <div
        className="about-banner"
        style={{
          backgroundImage: `url(${Banner1})`,
        }}
      >
        <div className="about-banner-overlay">
          <h1>Contact Us</h1>
          <p>we would like to hear from you</p>
        </div>
      </div>
      <div className="container mt-4">

      <form onSubmit={handleSubmit} className="pageant-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formState.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formState.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            rows="5"
            value={formState.message}
            onChange={handleChange}
            required
            placeholder="Your message"
          />
        </div>
        <button
          type="submit"
          className="red_button pageant-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {status && (
          <div className={`alert mt-3 ${status.includes("Thank you") ? "alert-success" : "alert-danger"}`}>
            {status}
          </div>
        )}
      </form>
    </div>
      </div>

    
    
  );
};

export default ContactForm;
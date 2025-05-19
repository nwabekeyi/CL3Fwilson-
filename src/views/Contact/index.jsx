import React from "react";
import Banner1 from "../../assets/images/banner_1.jpg";

function ContactPage() {
  return (
    <div className="contact-page">
      {/* Fixed Background Banner */}
      <div
        className="contact-banner"
        style={{
          backgroundImage: `url(${Banner1})`,
        }}
      >
        <div className="contact-banner-overlay">
          <h1>Contact Us</h1>
          <p>We would love to hear from you!</p>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="container contact-details-container" data-aos="fade-up">
        <div className="row">
          <div className="col-md-4 contact-detail-box">
            <h4>📍 Address</h4>
            <p>123 Tech Street, Innovation City<br />Lagos, Nigeria</p>
          </div>
          <div className="col-md-4 contact-detail-box">
            <h4>📞 Phone</h4>
            <p>+234 812 345 6789<br />+234 909 876 5432</p>
          </div>
          <div className="col-md-4 contact-detail-box">
            <h4>📧 Email & Hours</h4>
            <p>support@techacademy.com<br />Mon - Fri: 9am – 6pm</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container contact-form-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" className="form-control" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subject" className="form-control" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea id="message" className="form-control" rows="5" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

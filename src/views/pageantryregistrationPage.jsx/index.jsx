import React, { useState } from "react";
import Banner1 from "../../assets/images/banner_1.jpg";
import HomeBanner from "../../components/HomeBanner";


function PageantRegistrationPage() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    bio: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    // Clear error for the field
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.age || formData.age < 18 || formData.age > 35)
      newErrors.age = "Age must be between 18 and 35";
    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phone = "Valid phone number is required";
    if (!formData.bio.trim() || formData.bio.length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    if (!formData.photo) newErrors.photo = "Profile photo is required";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate form submission (replace with API call)
    console.log("Form submitted:", formData);
    setSubmitted(true);
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      age: "",
      phone: "",
      bio: "",
      photo: null,
    });
  };

  return (
    <div className="pageant-registration-page">
      <HomeBanner />
      {/* Fixed Background Banner */}
      <div
        className="pageant-banner"
        style={{
          backgroundImage: `url(${Banner1})`,
        }}
      >
        <div className="pageant-banner-overlay">
          <h1>Register for the MenStyle Pageant</h1>
          <p>Showcase your style and become the next fashion icon!</p>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="container pageant-form-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {submitted ? (
              <div className="submission-success">
                <h3>Thank You for Registering!</h3>
                <p>
                  Your application has been received. We’ll review your submission
                  and contact you within 3-5 business days.
                </p>
                <div className="red_button shop_now_button">
                  <a href="/pageant">Explore the Pageant</a>
                </div>
              </div>
            ) : (
              <form className="pageant-form" onSubmit={handleSubmit}>
                <div className="section_title">
                  <h2>Contestant Registration</h2>
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullName && (
                    <span className="error">{errors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="form-control"
                    placeholder="Your Age (18-35)"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="35"
                    required
                  />
                  {errors.age && <span className="error">{errors.age}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio (Tell us about yourself):</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    rows="5"
                    placeholder="Share your style story and why you want to join the pageant (min 50 characters)"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {errors.bio && <span className="error">{errors.bio}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="photo">Profile Photo:</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                  {errors.photo && <span className="error">{errors.photo}</span>}
                </div>
                <button type="submit" className="red_button pageant-submit-button">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageantRegistrationPage;
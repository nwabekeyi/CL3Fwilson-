import React, { useState } from "react";
import Banner1 from "../../assets/images/workshop4.jpg";
import HomeBanner from "../../components/HomeBanner";

function PageantRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    stageName: "",
    email: "",
    gender: "",
    age: "",
    nationality: "",
    stateOfOrigin: "",
    location: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

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

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare FormData for Formspree
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("stageName", formData.stageName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("stateOfOrigin", formData.stateOfOrigin);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("bio", formData.bio);

      // Send to Formspree
      const response = await fetch("https://formspree.io/f/mblyrwrw", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit form to Formspree.");
      }

      setSubmitted(true);
      // Reset form
      setFormData({
        fullName: "",
        stageName: "",
        email: "",
        gender: "",
        age: "",
        nationality: "",
        stateOfOrigin: "",
        location: "",
        phone: "",
        whatsapp: "",
        instagram: "",
        bio: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ ...errors, submission: "Failed to submit form. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1>Register for Project Cl3fwilson</h1>
          <p>Showcase your style and become the next fashion icon!</p>
        </div>
      </div>

      {/* About Project Cl3fwilson Section */}
      <div className="container about-project-section mt-5 mb-5" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="section_title">
              <h2>About Project Cl3fwilson</h2>
            </div>
            <p style={{ marginTop: "30px" }}>
              Project Cl3fwilson is a semi-annual fashion workshop and competition that creates a platform for fashion designers. It works to educate emerging fashion designers about sustainable theories, fashion business, branding, and marketing.
            </p>
            <p>
              The goal of this workshop is to help aspiring fashion designers develop a global brand mindset. Designers will be taught how to define and position their brands to the same standards as global brands.
            </p>
            <p>
              The competition creates a unique platform for passionate and talented fashion game-changers and rewards the best with career-changing prizes to maximize long-term impact. Each fashion competition cycle takes participants on an educational journey lasting for a month.
            </p>
            <h5>Who Can Participate?</h5>
            <ul>
              <li>Fashion creators</li>
              <li>Fashion designers</li>
              <li>Fashion illustrators</li>
              <li>Participants must be aged 18 years or older</li>
            </ul>
            <h5>Duration of the Show</h5>
            <p>
              The show will run for a period of one month. The contestants will be housed in a very conducive environment for a period of one month, relating with one another, learning, and completing fashion tasks and challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div id="registration-form" className="container pageant-form-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {submitted ? (
              <div className="submission-success">
                <h3>Thank You for Registering!</h3>
                <p>
                  Your application has been received. We’ll review your submission
                  and contact you within 3-5 business days.
                </p>
                <div className="h-auto red_button shop_now_button">
                  <a href="/pageant">Explore the Pageant</a>
                </div>
              </div>
            ) : (
              <form className="pageant-form" onSubmit={handleSubmit}>
                <div className="section_title">
                  <h2>Contestant Registration</h2>
                </div>
                <h5 className="my-4">Participant Details</h5>
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
                  <label htmlFor="stageName">Stage Name (if any):</label>
                  <input
                    type="text"
                    id="stageName"
                    name="stageName"
                    className="form-control"
                    placeholder="Your Stage Name"
                    value={formData.stageName}
                    onChange={handleChange}
                  />
                  {errors.stageName && (
                    <span className="error">{errors.stageName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Select your gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">I prefer not to say</option>
                  </select>
                  {errors.gender && <span className="error">{errors.gender}</span>}
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
                  <label htmlFor="nationality">Nationality:</label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    className="form-control"
                    placeholder="Your Nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                  />
                  {errors.nationality && (
                    <span className="error">{errors.nationality}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="stateOfOrigin">State of Origin:</label>
                  <input
                    type="text"
                    id="stateOfOrigin"
                    name="stateOfOrigin"
                    className="form-control"
                    placeholder="Your State of Origin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    required
                  />
                  {errors.stateOfOrigin && (
                    <span className="error">{errors.stateOfOrigin}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="location">Current Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    placeholder="Your Current Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  {errors.location && (
                    <span className="error">{errors.location}</span>
                  )}
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
                <h5 className="my-4">Contact Information</h5>
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
                  <label htmlFor="whatsapp">WhatsApp Number:</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    className="form-control"
                    placeholder="Your WhatsApp Number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                  />
                  {errors.whatsapp && (
                    <span className="error">{errors.whatsapp}</span>
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
                  <label htmlFor="instagram">Instagram Handle:</label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    className="form-control"
                    placeholder="Your Instagram Handle"
                    value={formData.instagram}
                    onChange={handleChange}
                    required
                  />
                  {errors.instagram && (
                    <span className="error">{errors.instagram}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="red_button pageant-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2 h-auto"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
                {errors.submission && (
                  <div className="text-danger mt-2">{errors.submission}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageantRegistrationPage;
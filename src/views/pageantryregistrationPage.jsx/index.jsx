import React, { useState } from "react";
import Banner1 from "../../assets/images/workshop4.jpg";
import HomeBanner from "../../components/HomeBanner";
import useApi from "../../hooks/useApi"; // Import the useApi hook

function PageantRegistrationPage() {
  const { request, loading: isSubmitting, error: apiError } = useApi(); // Use the hook
  const [formData, setFormData] = useState({
    fullName: "",
    brandName: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.age || formData.age < 18 || formData.age > 35)
      newErrors.age = "Age must be between 18 and 35";
    if (!formData.bio.trim() || formData.bio.length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
    if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "State of Origin is required";
    if (!formData.location.trim()) newErrors.location = "Current Location is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Send form data to backend API using useApi hook
      await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/send-registration-email`, // Replace with your backend URL
        method: "POST",
        data: {
          ...formData,
          age: parseInt(formData.age), // Ensure age is sent as a number
        },
      });

      setSubmitted(true);
      setFormData({
        fullName: "",
        brandName: "",
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
      console.error("Submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submission: error.message || "Submission failed. Please try again later.",
      }));
    }
  };

  return (
    <div className="pageant-registration-page">
      <HomeBanner />
      <div
        className="pageant-banner"
        style={{ backgroundImage: `url(${Banner1})` }}
      >
        <div className="pageant-banner-overlay">
          <h1>Register for Project Cl3fwilson</h1>
          <p>Showcase your style and become the next fashion icon!</p>
        </div>
      </div>

      <div className="container about-project-section mt-5 mb-5" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="section_title">
              <h2>About Project Cl3fwilson</h2>
            </div>
            <p className="mt-3">
              Project Cl3fwilson is a semi-annual fashion bootcamp and competition that
              creates a platform for fashion designers. It works to educate emerging
              fashion designers about sustainable theories, fashion business, branding,
              and marketing.
            </p>
            <p>
              The goal is to help aspiring designers develop a global brand mindset.
              Designers will learn how to position their brands to match global standards.
            </p>
            <p>
              The competition rewards the best with career-changing prizes and a
              month-long educational journey.
            </p>
            <h5>Who Can Participate?</h5>
            <ul>
              <li>Fashion creators</li>
              <li>Fashion designers</li>
              <li>Fashion illustrators</li>
              <li>Must be 18 years or older</li>
            </ul>
            <h5>Duration</h5>
            <p>
              One-month program in a shared, conducive environment with fashion tasks and challenges.
            </p>
          </div>
        </div>
      </div>

      <div className="container pageant-form-container" data-aos="fade-up" id="registration-form">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {submitted ? (
              <div className="submission-success">
                <h3>Thank You for Registering!</h3>
                <p>Your application has been received. We'll contact you soon.</p>
              </div>
            ) : (
              <form className="pageant-form" onSubmit={handleSubmit}>
                <div className="section_title">
                  <h2>Contestant Registration</h2>
                </div>

                {/* Fields */}
                {[
                  ["fullName", "Full Name"],
                  ["brandName", "Brand Name (if any)"],
                  ["email", "Email"],
                  ["age", "Age (18-35)"],
                  ["nationality", "Nationality"],
                  ["stateOfOrigin", "State of Origin"],
                  ["location", "Current Location"],
                  ["phone", "Phone Number"],
                  ["whatsapp", "WhatsApp Number"],
                  ["instagram", "Instagram Handle"],
                ].map(([name, label]) => (
                  <div className="form-group" key={name}>
                    <label htmlFor={name}>{label}:</label>
                    <input
                      type={name === "email" ? "email" : name === "age" ? "number" : "text"}
                      id={name}
                      name={name}
                      className="form-control"
                      placeholder={label}
                      value={formData[name]}
                      onChange={handleChange}
                      required={["fullName", "email", "age", "nationality", "stateOfOrigin", "location", "phone"].includes(name)}
                    />
                    {errors[name] && <span className="error">{errors[name]}</span>}
                  </div>
                ))}

                {/* Gender */}
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
                    <option value="" disabled>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <span className="error">{errors.gender}</span>}
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label htmlFor="bio">Bio:</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    rows="5"
                    placeholder="Tell us your story (min 50 characters)"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {errors.bio && <span className="error">{errors.bio}</span>}
                </div>

                {/* Submission Error */}
                {errors.submission && (
                  <div className="alert alert-danger">{errors.submission}</div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
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
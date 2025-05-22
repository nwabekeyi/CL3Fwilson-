import React, { useState } from "react";
import Banner1 from "../../assets/images/banner_1.jpg";
import HomeBanner from "../../components/HomeBanner";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "../../utils/cloudinary";

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
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: 'Only JPG, PNG, or GIF allowed!' });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: 'Image must be smaller than 5MB!' });
      return;
    }

    // Create preview
    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);

    // Update form data
    setFormData({ ...formData, photo: file });
    setErrors({ ...errors, photo: '' });
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
    if (!formData.photo) newErrors.photo = "Profile photo is required";

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
      // Upload photo to Cloudinary
      let photoURL = '';
      if (formData.photo) {
        photoURL = await uploadImage(formData.photo);
      }

      // Prepare data for Firestore
      const contestantData = {
        fullName: formData.fullName,
        stageName: formData.stageName,
        email: formData.email,
        gender: formData.gender,
        age: Number(formData.age),
        nationality: formData.nationality,
        stateOfOrigin: formData.stateOfOrigin,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        bio: formData.bio,
        photoURL,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      // Save to Firestore
      await addDoc(collection(db, "pageantContestants"), contestantData);
      
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
        photo: null,
      });
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({...errors, submission: "Failed to submit form. Please try again."});
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... [keep all your existing JSX return code, but update the photo input section as shown below]

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
                <div className="h-auto red_button shop_now_button">
                  <a href="/pageant">Explore the Pageant</a>
                </div>
              </div>
            ) : (
              <form className="pageant-form" onSubmit={handleSubmit}>
                <div className="section_title">
                  <h2>Contestant Registration</h2>
                </div>
                <h5 className="my-4">
                  Participant Details
                </h5>
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
                    placeholder="Your stage Name"
                    value={formData.stageName}
                    onChange={handleChange}
                    required
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
                    <option value="" disabled hidden>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">I prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <span className="error">{errors.gender}</span>
                  )}
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
                  {errors.nationality && <span className="error">{errors.nationality}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State of origin:</label>
                  <input
                    type="text"
                    id="state"
                    name="stateOfOrigin"
                    className="form-control"
                    placeholder="Your State of origin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    required
                  />
                  {errors.stateOfOrigin && <span className="error">{errors.stateOfOrigin}</span>}
                </div>
                   <div className="form-group">
                  <label htmlFor="location">Current Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    placeholder="Your current location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  {errors.location && <span className="error">{errors.location}</span>}
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
                    onChange={handlePhotoChange}
                    required
                  />
                  
                  {/* Image Preview */}
                  {photoPreview && (
                    <div className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}

                  {/* Upload Progress Bar */}
                  {isSubmitting && (
                    <div className="progress mt-2">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: '100%' }}
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        Uploading...
                      </div>
                    </div>
                  )}

                  {errors.photo && <div className="text-danger">{errors.photo}</div>}
                </div>
                 <h5 className="my-4">
                  Contact Information
                </h5>
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
                  <label htmlFor="whatsapp">Whatsapp Number:</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    className="form-control"
                    placeholder="Your Whatsapp Number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                  />
                  {errors.whatsapp && <span className="error">{errors.whatsapp}</span>}
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
                  {errors.instagram && <span className="error">{errors.instagram}</span>}
                </div>
               
                <button 
                  type="submit" 
                  className="red_button pageant-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2 h-auto" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
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
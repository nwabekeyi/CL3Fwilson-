// src/components/ContestManager/ContestForm.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ContestForm = ({
  formData,
  errors,
  isSubmitting,
  loading,
  editContest,
  handleChange,
  handleDateChange,
  handleContestSubmit,
  handleResetContest,
  setShowForm,
}) => {
  return (
    <form onSubmit={handleContestSubmit} noValidate className="mb-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Contest Name
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting || loading}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => handleDateChange('startDate', date)}
          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
          placeholderText="Select start date"
          dateFormat="yyyy-MM-dd"
          disabled={isSubmitting || loading}
        />
        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">End Date</label>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => handleDateChange('endDate', date)}
          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
          placeholderText="Select end date"
          dateFormat="yyyy-MM-dd"
          disabled={isSubmitting || loading}
        />
        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? 'Saving...' : editContest ? 'Update Contest' : 'Create Contest'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleResetContest} disabled={isSubmitting || loading}>
          Reset
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setShowForm(false);
            handleResetContest();
          }}
          disabled={isSubmitting || loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContestForm;
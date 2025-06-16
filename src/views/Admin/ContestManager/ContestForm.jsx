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
    <form onSubmit={handleContestSubmit} noValidate className="form">
      <div className="form-group">
        <label htmlFor="name">Contest Name</label>
        <input
          type="text"
          className={errors.name ? 'error' : ''}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting || loading}
        />
        {errors.name && <div className="error-feedback">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => handleDateChange('startDate', date)}
          className={errors.startDate ? 'error' : ''}
          placeholderText="Select start date"
          dateFormat="yyyy-MM-dd"
          disabled={isSubmitting || loading}
        />
        {errors.startDate && <div className="error-feedback">{errors.startDate}</div>}
      </div>

      <div className="form-group">
        <label>End Date</label>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => handleDateChange('endDate', date)}
          className={errors.endDate ? 'error' : ''}
          placeholderText="Select end date"
          dateFormat="yyyy-MM-dd"
          disabled={isSubmitting || loading}
        />
        {errors.endDate && <div className="error-feedback">{errors.endDate}</div>}
      </div>

      <div className="button-group">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? 'Saving...' : editContest ? 'Update Workshop' : 'Create Workshop'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleResetContest}
          disabled={isSubmitting || loading}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn-outline"
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
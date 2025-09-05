// src/components/ParticipantManager/ParticipantManager.jsx
import React, { useState, useEffect } from 'react';
import { useParticipantForm } from '../../../hooks/useParticipantForm';
import useApi from '../../../hooks/useApi';

import ContestManager from '../ContestManager';

const ParticipantManager = ({ successMessage, setSuccessMessage, contestId: externalContestId }) => {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
  } = useParticipantForm();
  const { request, loading, error: apiError } = useApi();
  const [participants, setParticipants] = useState([]);
  const [participantsError, setParticipantsError] = useState('');
  const [editParticipant, setEditParticipant] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [currentVotes, setCurrentVotes] = useState([]);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [contestId, setContestId] = useState(externalContestId || null); // Local contestId state

  // Sync local contestId with externalContestId if provided
  useEffect(() => {
    setContestId(externalContestId || null);
  }, [externalContestId]);

  // Fetch participants when contestId changes
  useEffect(() => {
    if (contestId) {
      fetchParticipants();
    } else {
      setParticipants([]);
      setParticipantsError('No contest selected. Please select a contest.');
    }
  }, [contestId]);

  const fetchParticipants = async () => {
    try {
      const data = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants`,
        method: 'GET',
      });
      setParticipants(data);
      setParticipantsError('');
    } catch (error) {
      setParticipantsError('Failed to fetch participants');
      setParticipants([]);
    }
  };

  // Cleanup preview image
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: '' }));
    } else {
      setPreviewImage(null);
      setFormData((prev) => ({ ...prev, photo: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !contestId) return;
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('about', formData.about);
    if (formData.photo) formDataToSend.append('photo', formData.photo);
    if (editParticipant) {
      formDataToSend.append('votesToAdd', formData.votesToAdd);
      formDataToSend.append('contestId', contestId);
    }

    try {
      const url = editParticipant
        ? `${import.meta.env.VITE_CONTEST_ENDPOINT}/participants/${editParticipant.codeName}`
        : `${import.meta.env.VITE_CONTEST_ENDPOINT}/participants/${contestId}`;

      const response = await fetch(url, {
        method: editParticipant ? 'PUT' : 'POST',
        body: formDataToSend,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const result = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(result?.error || result || 'Failed to submit form');
      }

      resetForm();
      setEditParticipant(null);
      setPreviewImage(null);
      setSuccessMessage(
        editParticipant
          ? `Participant updated successfully!${formData.votesToAdd > 0 ? ` Added ${formData.votesToAdd} votes.` : ''}`
          : 'Participant added successfully!'
      );
      fetchParticipants();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewVotes = async (participant) => {
    try {
      setCurrentParticipant(participant);
      const response = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants/${participant.codeName}/votes`,
        method: 'GET',
      });
      setCurrentVotes(response || []);
      setShowVotesModal(true);
    } catch (error) {
      setErrors({ submission: 'Failed to fetch votes' });
      setCurrentVotes([]);
      setShowVotesModal(true);
    }
  };

  const handleEditParticipant = (participant) => {
    const newFormData = {
      fullName: String(participant.fullName || ''),
      email: String(participant.email || ''),
      about: String(participant.about || ''),
      photo: null,
      votesToAdd: '0',
    };
    setEditParticipant(participant);
    setFormData(newFormData);
    setPreviewImage(participant.photo || null);
  };

  const handleDeleteParticipant = async (codeName) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this participant? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/participants/${codeName}`,
          method: 'DELETE',
        });
        setSuccessMessage('Participant deleted successfully!');
        fetchParticipants();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrors({ submission: 'Failed to delete participant' });
      }
    }
  };

  return (
    <div className="container-fluid">
      {/* Contest Management Section */}
        <ContestManager setContestId={setContestId} />

      {/* Existing Participant Management Content */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {participantsError && <div className="alert alert-danger">{participantsError}</div>}
      {(errors.submission || apiError) && (
        <div className="alert alert-danger">{errors.submission || apiError}</div>
      )}
    </div>
  );
};

export default ParticipantManager;
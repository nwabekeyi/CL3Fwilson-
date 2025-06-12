// src/hooks/useContestManager.js
import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';

export const useContestManager = (setContestId) => {
  const { request, loading, error: apiError } = useApi();
  const [contests, setContests] = useState([]);
  const [formData, setFormData] = useState({ name: '', startDate: null, endDate: null });
  const [participantFormData, setParticipantFormData] = useState({
    fullName: '',
    email: '',
    about: '',
    photo: null,
  });
  const [voteFormData, setVoteFormData] = useState({ voteCount: '' }); // State for vote form
  const [editContest, setEditContest] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showViewParticipantsModal, setShowViewParticipantsModal] = useState(false);
  const [showAddVotesModal, setShowAddVotesModal] = useState(false); // State for vote modal
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [selectedParticipantCodeName, setSelectedParticipantCodeName] = useState(null); // State for participant
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const data = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}`,
        method: 'GET',
      });
      setContests(data);
      if (data.length > 0 && !editContest) {
        setContestId(data[0].id);
      }
    } catch (err) {
      setErrors({ fetch: err.message || 'Failed to fetch contests' });
    }
  };

  const fetchParticipants = async (contestId) => {
    try {
      const data = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants`,
        method: 'GET',
      });
      setParticipants(data);
    } catch (err) {
      setErrors({ fetchParticipants: err.message || 'Failed to fetch participants' });
    }
  };

  const validateContestForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Contest name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    return newErrors;
  };

  const validateParticipantForm = () => {
    const newErrors = {};
    if (!participantFormData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!participantFormData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(participantFormData.email)) newErrors.email = 'Invalid email format';
    if (!participantFormData.about.trim()) newErrors.about = 'About is required';
    return newErrors;
  };

  const validateVoteForm = () => {
    const newErrors = {};
    if (!voteFormData.voteCount || isNaN(parseInt(voteFormData.voteCount)) || parseInt(voteFormData.voteCount) <= 0) {
      newErrors.voteCount = 'Vote count must be a positive integer';
    }
    return newErrors;
  };

  const handleContestSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateContestForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };

      if (editContest) {
        await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${editContest.id}`,
          method: 'PUT',
          data: formattedData,
        });
        setSuccessMessage('Contest updated successfully!');
      } else {
        const newContest = await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}`,
          method: 'POST',
          data: formattedData,
        });
        setSuccessMessage('Contest created successfully!');
        setContestId(newContest.id);
      }

      setFormData({ name: '', startDate: null, endDate: null });
      setEditContest(null);
      setErrors({});
      setShowForm(false);
      fetchContests();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submission: err.message || 'Failed to save contest' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipantSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateParticipantForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', participantFormData.fullName);
      formDataToSend.append('email', participantFormData.email);
      formDataToSend.append('about', participantFormData.about);
      if (participantFormData.photo) {
        formDataToSend.append('photo', participantFormData.photo);
      }

      await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${selectedContestId}/participants`,
        method: 'POST',
        data: formDataToSend,
      });

      setSuccessMessage('Participant added successfully!');
      setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
      setShowAddParticipantModal(false);
      fetchParticipants(selectedContestId);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submission: err.message || 'Failed to add participant' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateVoteForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${selectedContestId}/participants/${selectedParticipantCodeName}/votes`,
        method: 'POST',
        data: { voteCount: parseInt(voteFormData.voteCount) },
      });

      setSuccessMessage('Votes added successfully!');
      setVoteFormData({ voteCount: '' });
      setShowAddVotesModal(false);
      fetchParticipants(selectedContestId);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ submission: err.message || 'Failed to add votes' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetContest = () => {
    setFormData({ name: '', startDate: null, endDate: null });
    setErrors({});
    if (!editContest) setSuccessMessage('Form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResetParticipant = () => {
    setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
    setErrors({});
    setSuccessMessage('Participant form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResetVotes = () => {
    setVoteFormData({ voteCount: '' });
    setErrors({});
    setSuccessMessage('Vote form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleParticipantChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setParticipantFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setParticipantFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleVoteChange = (e) => {
    const { name, value } = e.target;
    setVoteFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleEdit = (contest) => {
    setFormData({
      name: contest.name,
      startDate: new Date(contest.startDate),
      endDate: new Date(contest.endDate),
    });
    setEditContest(contest);
    setContestId(contest.id);
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}`,
          method: 'DELETE',
        });
        setSuccessMessage('Contest deleted successfully!');
        fetchContests();
        setContestId(contests[0]?.id || null);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrors({ submission: err.message || 'Failed to delete contest' });
      }
    }
  };

  const handleSelectContest = (contestId) => setContestId(contestId);

  const handleAddContest = () => {
    setShowForm(true);
    setFormData({ name: '', startDate: null, endDate: null });
    setEditContest(null);
    setErrors({});
  };

  const handleAddParticipant = (contestId) => {
    setSelectedContestId(contestId);
    setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
    setErrors({});
    setShowAddParticipantModal(true);
  };

  const handleViewParticipants = (contestId) => {
    setSelectedContestId(contestId);
    setParticipants([]);
    fetchParticipants(contestId);
    setShowViewParticipantsModal(true);
  };

  const handleAddVotes = (contestId, participantCodeName) => {
    setSelectedContestId(contestId);
    setSelectedParticipantCodeName(participantCodeName);
    setVoteFormData({ voteCount: '' });
    setErrors({});
    setShowAddVotesModal(true);
  };

  return {
    contests,
    formData,
    participantFormData,
    voteFormData,
    editContest,
    errors,
    successMessage,
    isSubmitting,
    showForm,
    showAddParticipantModal,
    showViewParticipantsModal,
    showAddVotesModal,
    selectedContestId,
    selectedParticipantCodeName,
    participants,
    loading,
    apiError,
    setShowForm,
    setShowAddParticipantModal,
    setShowViewParticipantsModal,
    setShowAddVotesModal,
    handleChange,
    handleParticipantChange,
    handleVoteChange,
    handleDateChange,
    handleContestSubmit,
    handleParticipantSubmit,
    handleVoteSubmit,
    handleResetContest,
    handleResetParticipant,
    handleResetVotes,
    handleEdit,
    handleDelete,
    handleSelectContest,
    handleAddContest,
    handleAddParticipant,
    handleViewParticipants,
    handleAddVotes,
  };
};
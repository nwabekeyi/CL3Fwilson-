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
  const [voteFormData, setVoteFormData] = useState({ voteCount: '', voterName: '' });
  const [editContest, setEditContest] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showViewParticipantsModal, setShowViewParticipantsModal] = useState(false);
  const [showAddVotesModal, setShowAddVotesModal] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [selectedParticipantCodeName, setSelectedParticipantCodeName] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = useCallback(async () => {
    try {
      const data = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}`,
        method: 'GET',
      });
      setContests(data);

      const allParticipants = [];
      for (const contest of data) {
        try {
          const participantData = await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contest.id}/participants`,
            method: 'GET',
          });
          allParticipants.push(
            ...participantData.map((p) => ({
              ...p,
              contestId: contest.id,
            }))
          );
        } catch (err) {
          console.warn(`Failed to fetch participants for contest ${contest.id}:`, err);
          setErrors((prev) => ({
            ...prev,
            [`fetchParticipants_${contest.id}`]: err.message || 'Failed to fetch participants',
          }));
        }
      }
      setParticipants(allParticipants);

      if (data.length > 0 && !editContest) {
        setContestId(data[0].id);
      }
    } catch (err) {
      console.error('Fetch contests error:', err);
      setErrors({ fetch: err.message || 'Failed to fetch contests' });
    }
  }, [request, editContest, setContestId]);

  const fetchParticipants = useCallback(
    async (contestId) => {
      try {
        const data = await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants`,
          method: 'GET',
        });
        setParticipants(data.map((p) => ({ ...p, contestId })));
      } catch (err) {
        console.error('Fetch participants error:', err);
        setErrors({ fetchParticipants: err.message || 'Failed to fetch participants' });
      }
    },
    [request]
  );

  const validateContestForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Contest name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else if (formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    return newErrors;
  }, [formData]);

  const validateParticipantForm = useCallback(() => {
    const newErrors = {};
    if (!participantFormData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!participantFormData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(participantFormData.email)) newErrors.email = 'Invalid email format';
    if (!participantFormData.about.trim()) newErrors.about = 'About is required';
    return newErrors;
  }, [participantFormData]);

  const validateVoteForm = useCallback(() => {
    const newErrors = {};
    if (
      !voteFormData.voteCount ||
      isNaN(parseInt(voteFormData.voteCount)) ||
      parseInt(voteFormData.voteCount) <= 0
    ) {
      newErrors.voteCount = 'Vote count must be a positive integer';
    }
    if (!voteFormData.voterName.trim()) newErrors.voterName = 'Voter name is required';
    return newErrors;
  }, [voteFormData]);

  const handleContestSubmit = useCallback(
    async (e) => {
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
        await fetchContests();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Contest submit error:', err);
        setErrors({ submission: err.message || 'Failed to save contest' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, validateContestForm, formData, editContest, request, setContestId, fetchContests]
  );

  const handleParticipantSubmit = useCallback(
    async (e) => {
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
        await fetchParticipants(selectedContestId);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Participant submit error:', err);
        setErrors({ submission: err.message || 'Failed to add participant' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, validateParticipantForm, participantFormData, selectedContestId, request, fetchParticipants]
  );

  const handleVoteSubmit = useCallback(
    async (e) => {
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
          data: {
            voteCount: parseInt(voteFormData.voteCount),
            voterName: voteFormData.voterName,
          },
        });

        setSuccessMessage('Votes added successfully!');
        setVoteFormData({ voteCount: '', voterName: '' });
        setShowAddVotesModal(false);
        await fetchParticipants(selectedContestId);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Vote submit error:', err);
        setErrors({ submission: err.message || 'Failed to add votes' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateVoteForm,
      selectedContestId,
      selectedParticipantCodeName,
      voteFormData,
      request,
      fetchParticipants,
    ]
  );

  const handleEvictParticipant = useCallback(
    async (contestId, codeName) => {
      if (!contestId || !codeName) {
        setErrors({ submission: 'Contest ID and participant code name are required' });
        return;
      }

      if (window.confirm(`Are you sure you want to evict participant ${codeName}?`)) {
        setIsSubmitting(true);
        try {
          const evictionUrl = `${import.meta.env.VITE_CONTEST_ENDPOINT}/participants/evict/${codeName}`;
          console.log(`Sending eviction request to: ${evictionUrl}`);
          await request({
            url: evictionUrl,
            method: 'PATCH',
          });
          setSuccessMessage(`Participant ${codeName} evicted successfully!`);
          await fetchParticipants(contestId);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          console.error('Eviction error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });
          setErrors({
            submission: err.response?.data?.error || err.message || 'Failed to evict participant. Please try again.',
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [request, fetchParticipants]
  );

  const handleDeleteParticipant = useCallback(
    async (contestId, codeName) => {
      if (!contestId || !codeName) {
        setErrors({ submission: 'Contest ID and participant code name are required' });
        return;
      }

      if (window.confirm(`Are you sure you want to permanently delete participant ${codeName}?`)) {
        setIsSubmitting(true);
        try {
          const deleteUrl = `${import.meta.env.VITE_CONTEST_ENDPOINT}/participants/${codeName}`;
          console.log(`Sending delete request to: ${deleteUrl}`);
          await request({
            url: deleteUrl,
            method: 'DELETE',
          });
          setSuccessMessage(`Participant ${codeName} deleted successfully!`);
          await fetchParticipants(contestId);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          console.error('Delete participant error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });
          setErrors({
            submission: err.response?.data?.error || err.message || 'Failed to delete participant. Please try again.',
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [request, fetchParticipants]
  );

  const handleResetContest = useCallback(() => {
    setFormData({ name: '', startDate: null, endDate: null });
    setErrors({});
    if (!editContest) setSuccessMessage('Form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [editContest]);

  const handleResetParticipant = useCallback(() => {
    setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
    setErrors({});
    setSuccessMessage('Participant form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleResetVotes = useCallback(() => {
    setVoteFormData({ voteCount: '', voterName: '' });
    setErrors({});
    setSuccessMessage('Vote form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleParticipantChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setParticipantFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setParticipantFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleVoteChange = useCallback((e) => {
    const { name, value } = e.target;
    setVoteFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleDateChange = useCallback((name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleEdit = useCallback(
    (contest) => {
      setFormData({
        name: contest.name,
        startDate: new Date(contest.startDate),
        endDate: new Date(contest.endDate),
      });
      setEditContest(contest);
      setContestId(contest.id);
      setErrors({});
      setShowForm(true);
    },
    [setContestId]
  );

  const handleDelete = useCallback(
    async (contestId) => {
      if (window.confirm('Are you sure you want to delete this contest?')) {
        try {
          await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}`,
            method: 'DELETE',
          });
          setSuccessMessage('Contest deleted successfully!');
          await fetchContests();
          setContestId(contests[0]?.id || null);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
          console.error('Delete contest error:', err);
          setErrors({ submission: err.message || 'Failed to delete contest' });
        }
      }
    },
    [request, fetchContests, contests, setContestId]
  );

  const handleSelectContest = useCallback(
    (contestId) => {
      setContestId(contestId);
    },
    [setContestId]
  );

  const handleAddContest = useCallback(() => {
    setShowForm(true);
    setFormData({ name: '', startDate: null, endDate: null });
    setEditContest(null);
    setErrors({});
  }, []);

  const handleAddParticipant = useCallback(
    (contestId) => {
      console.log('handleAddParticipant called with contestId:', contestId);
      setSelectedContestId(contestId);
      setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
      setErrors({});
      setShowAddParticipantModal(true);
      setShowViewParticipantsModal(false);
      setShowAddVotesModal(false);
      setContestId(contestId);
    },
    [setContestId]
  );

  const handleViewParticipants = useCallback(
    (contestId) => {
      console.log('handleViewParticipants called with contestId:', contestId);
      setSelectedContestId(contestId);
      setParticipants([]);
      fetchParticipants(contestId);
      setShowViewParticipantsModal(true);
      setShowAddParticipantModal(false);
      setShowAddVotesModal(false);
      setContestId(contestId);
    },
    [fetchParticipants, setContestId]
  );

  const handleAddVotes = useCallback((contestId, participantCodeName) => {
    console.log('handleAddVotes called with contestId:', contestId, 'participantCodeName:', participantCodeName);
    setSelectedContestId(contestId);
    setSelectedParticipantCodeName(participantCodeName);
    setVoteFormData({ voteCount: '', voterName: '' });
    setErrors({});
    setShowAddVotesModal(true);
    setShowAddParticipantModal(false);
    setShowViewParticipantsModal(false);
  }, []);

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
    handleEvictParticipant,
    handleDeleteParticipant, // Add new handler to return object
  };
};
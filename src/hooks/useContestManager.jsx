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

  // Validate ObjectId (24-character hexadecimal string)
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = useCallback(async () => {
    try {
      const data = await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}`,
        method: 'GET',
      });
      const transformedContests = data.map((contest) => ({
        ...contest,
        id: contest._id,
      }));
      setContests(transformedContests);

      const allParticipants = [];
      for (const contest of transformedContests) {
        if (!isValidObjectId(contest.id)) {
          console.warn(`Invalid contestId: ${contest.id}`);
          continue;
        }
        try {
          const participantData = await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contest.id}/participants`,
            method: 'GET',
          });
          allParticipants.push(
            ...participantData.map((p) => ({
              ...p,
              contestId: contest.id,
              id: p._id,
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

      if (transformedContests.length > 0 && !editContest) {
        const validContest = transformedContests.find((c) => isValidObjectId(c.id));
        if (validContest) {
          setContestId(validContest.id);
        } else {
          setContestId(null);
          setErrors({ fetch: 'No valid contests found' });
        }
      }
      // Clear fetch-related errors on success
      setErrors((prev) => ({
        ...prev,
        fetch: undefined,
        fetchParticipants: undefined,
      }));
    } catch (err) {
      console.error('Fetch contests error:', err);
      setErrors({ fetch: err.message || 'Failed to fetch contests' });
    }
  }, [request, editContest, setContestId]);

  const fetchParticipants = useCallback(
    async (contestId) => {
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ fetchParticipants: 'Valid contestId is required' });
        return;
      }
      try {
        const data = await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants`,
          method: 'GET',
        });
        setParticipants(data.map((p) => ({ ...p, contestId, id: p._id })));
        // Clear fetchParticipants error on success
        setErrors((prev) => ({ ...prev, fetchParticipants: undefined }));
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
    if (!participantFormData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!participantFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(participantFormData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!participantFormData.about.trim()) {
      newErrors.about = 'About is required';
    } else if (participantFormData.about.trim().length < 50) {
      newErrors.about = 'About must be at least 50 characters long';
    }
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
          name: formData.name,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
        };

        if (editContest) {
          if (!isValidObjectId(editContest.id)) {
            throw new Error('Invalid contestId for update');
          }
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
          setContestId(newContest._id);
        }

        setFormData({ name: '', startDate: null, endDate: null });
        setEditContest(null);
        setErrors({}); // Already clears errors on success
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

      if (!selectedContestId || !isValidObjectId(selectedContestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }

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

        const newParticipant = await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${selectedContestId}/participants`,
          method: 'POST',
          data: formDataToSend,
        });

        setSuccessMessage('Participant added successfully!');
        setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
        setErrors({}); // Clear errors on success
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

      if (!selectedContestId || !isValidObjectId(selectedContestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      if (!selectedParticipantCodeName) {
        setErrors({ submission: 'Participant codeName is required' });
        return;
      }

      const validationErrors = validateVoteForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const participant = await request({
          url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${selectedContestId}/participants/${selectedParticipantCodeName}`,
          method: 'GET',
        });

        if (!participant || !participant._id) {
          throw new Error('Participant not found');
        }

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
        setErrors({}); // Clear errors on success
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
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      if (!codeName) {
        setErrors({ submission: 'Participant code name is required' });
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
          setErrors({}); // Clear errors on success
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
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      if (!codeName) {
        setErrors({ submission: 'Participant code name is required' });
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
          setErrors({}); // Clear errors on success
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
    setErrors({}); // Already clears errors
    if (!editContest) setSuccessMessage('Form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [editContest]);

  const handleResetParticipant = useCallback(() => {
    setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
    setErrors({}); // Already clears errors
    setSuccessMessage('Participant form reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  }, []);

  const handleResetVotes = useCallback(() => {
    setVoteFormData({ voteCount: '', voterName: '' });
    setErrors({}); // Already clears errors
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
      if (!isValidObjectId(contest.id)) {
        setErrors({ submission: 'Invalid contestId for editing' });
        return;
      }
      setFormData({
        name: contest.name,
        startDate: new Date(contest.startDate),
        endDate: new Date(contest.endDate),
      });
      setEditContest(contest);
      setContestId(contest.id);
      setErrors({}); // Clear errors when editing
      setShowForm(true);
    },
    [setContestId]
  );

  const handleDelete = useCallback(
    async (contestId) => {
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }

      if (window.confirm('Are you sure you want to delete this contest?')) {
        try {
          await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}`,
            method: 'DELETE',
          });
          setSuccessMessage('Contest deleted successfully!');
          setErrors({}); // Clear errors on success
          await fetchContests();
          const validContest = contests.find((c) => isValidObjectId(c.id));
          setContestId(validContest ? validContest.id : null);
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
      if (!isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      setContestId(contestId);
      setErrors({}); // Clear errors when selecting a contest
    },
    [setContestId]
  );

  const handleAddContest = useCallback(() => {
    setShowForm(true);
    setFormData({ name: '', startDate: null, endDate: null });
    setEditContest(null);
    setErrors({}); // Already clears errors
  }, []);

  const handleAddParticipant = useCallback(
    (contestId) => {
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      console.log('handleAddParticipant called with contestId:', contestId);
      setSelectedContestId(contestId);
      setParticipantFormData({ fullName: '', email: '', about: '', photo: null });
      setErrors({}); // Already clears errors
      setShowAddParticipantModal(true);
      setShowViewParticipantsModal(false);
      setShowAddVotesModal(false);
      setContestId(contestId);
    },
    [setContestId]
  );

  const handleViewParticipants = useCallback(
    (contestId) => {
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      console.log('handleViewParticipants called with contestId:', contestId);
      setSelectedContestId(contestId);
      setParticipants([]);
      fetchParticipants(contestId);
      setErrors({}); // Clear errors when viewing participants
      setShowViewParticipantsModal(true);
      setShowAddParticipantModal(false);
      setShowAddVotesModal(false);
      setContestId(contestId);
    },
    [fetchParticipants, setContestId]
  );

  const handleAddVotes = useCallback(
    (contestId, participantCodeName) => {
      if (!contestId || !isValidObjectId(contestId)) {
        setErrors({ submission: 'Valid contestId is required' });
        return;
      }
      if (!participantCodeName) {
        setErrors({ submission: 'Participant codeName is required' });
        return;
      }
      console.log('handleAddVotes called with contestId:', contestId, 'participantCodeName:', participantCodeName);
      setSelectedContestId(contestId);
      setSelectedParticipantCodeName(participantCodeName);
      setVoteFormData({ voteCount: '', voterName: '' });
      setErrors({}); // Already clears errors
      setShowAddVotesModal(true);
      setShowAddParticipantModal(false);
      setShowViewParticipantsModal(false);
    },
    []
  );

  // Handlers for modal closure to clear errors
  const handleCloseAddParticipantModal = useCallback(() => {
    setShowAddParticipantModal(false);
    setErrors({});
  }, []);

  const handleCloseViewParticipantsModal = useCallback(() => {
    setShowViewParticipantsModal(false);
    setErrors({});
  }, []);

  const handleCloseAddVotesModal = useCallback(() => {
    setShowAddVotesModal(false);
    setErrors({});
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
    setShowAddParticipantModal: handleCloseAddParticipantModal,
    setShowViewParticipantsModal: handleCloseViewParticipantsModal,
    setShowAddVotesModal: handleCloseAddVotesModal,
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
    handleDeleteParticipant,
  };
};
import React, { useState, useEffect } from 'react';
import { useParticipantForm } from '../../../hooks/useParticipantForm';
import { addParticipant, deleteParticipant } from '../../../utils/firestoreUtils';
import { uploadImage } from '../../../utils/cloudinary';
import { generateUniqueTransactionId, getRandomTransactionId } from '../../../utils/VotesUtils';
import ParticipantForm from './ParticipantForm';
import ParticipantTable from './ParticipantTable';
import VotesModal from './VotesModal';
import { db } from '../../../firebase/config';
import { collection, query, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const ParticipantManager = ({ participants, participantsError, successMessage, setSuccessMessage }) => {
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
  const [editParticipant, setEditParticipant] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showVotesModal, setShowVotesModal] = useState(false);
  const [currentVoters, setCurrentVoters] = useState([]);
  const [currentParticipant, setCurrentParticipant] = useState(null);

  useEffect(() => {
    console.log('editParticipant state:', editParticipant);
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, editParticipant]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = e.target;
      const photoFile = form.photo.files[0];
      let photoURL = 'https://via.placeholder.com/800x600?text=No+Image';

      if (photoFile) {
        photoURL = await uploadImage(photoFile);
      }

      await addParticipant(db, {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
        photoURL,
        voters: [],
        createdAt: new Date(),
      });
      resetForm();
      form.reset();
      setPreviewImage(null);
      setSuccessMessage('Participant added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: `Failed to add participant: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewVotes = (participant) => {
    setCurrentParticipant(participant);
    setCurrentVoters(participant.voters || []);
    setShowVotesModal(true);
  };

  const handleEditParticipant = (participant) => {
    console.log('handleEditParticipant called with:', participant);
    const newFormData = {
      fullName: String(participant.fullName || ''),
      codeName: String(participant.codeName || ''),
      email: String(participant.email || ''),
      about: String(participant.about || ''),
      photoURL: String(participant.photoURL || ''),
      votesToAdd: '0',
    };
    setEditParticipant(participant);
    setFormData(newFormData);
    setPreviewImage(participant.photoURL || null);
    console.log('New form data set:', newFormData);
  };

  const handleUpdateParticipant = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = e.target;
      const photoFile = form.photo.files[0];
      let photoURL = formData.photoURL || 'https://via.placeholder.com/800x600?text=No+Image';

      if (photoFile) {
        photoURL = await uploadImage(photoFile);
      }

      const votesToAdd = parseInt(formData.votesToAdd) || 0;
      const newTransactionIds = []; // Store only transactionIds for voters array

      // Fetch latest participant data
      const participantRef = doc(db, 'participants', editParticipant.docId);
      const participantSnap = await getDoc(participantRef);
      if (!participantSnap.exists()) {
        throw new Error('Participant not found');
      }
      const currentParticipant = participantSnap.data();
      const existingVoters = currentParticipant.voters || [];

      console.log('Current voters from DB:', existingVoters.length);
      console.log('Votes to add:', votesToAdd);

      if (votesToAdd > 0) {
        const votesQuery = query(collection(db, 'votes'));
        const votesSnapshot = await getDocs(votesQuery);
        const allVotes = votesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const votesCollectionEmpty = allVotes.length === 0;

        if (votesCollectionEmpty && votesToAdd > 20) {
          alert('Cannot add more than 20 votes when no existing votes are available.');
          throw new Error('Cannot add more than 20 votes when no existing votes are available.');
        }

        for (let i = 0; i < votesToAdd; i++) {
          const randomTransactionId = await getRandomTransactionId(db);
          const newTransactionId = await generateUniqueTransactionId(randomTransactionId, db);

          const newVoter = {
            transactionId: newTransactionId,
            email: 'admin_added',
            timestamp: new Date(),
          };

          if (!existingVoters.includes(newTransactionId)) {
            newTransactionIds.push(newTransactionId);
            await setDoc(doc(db, 'votes', newTransactionId), {
              participantId: editParticipant.docId,
              email: newVoter.email,
              timestamp: newVoter.timestamp,
            });
          } else {
            i--; // Retry if duplicate
          }
        }

        if (votesCollectionEmpty) {
          setErrors({
            ...errors,
            submission: 'Warning: No existing votes available. Generated new transaction IDs.',
          });
        }
      }

      // Update participant with arrayUnion for new transactionIds
      const updatedData = {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
        photoURL,
        updatedAt: new Date(),
      };

      if (newTransactionIds.length > 0) {
        await updateDoc(participantRef, {
          ...updatedData,
          voters: arrayUnion(...newTransactionIds),
        });
      } else {
        await updateDoc(participantRef, updatedData);
      }

      console.log('New transactionIds added:', newTransactionIds.length);
      console.log('Expected voters count:', existingVoters.length + newTransactionIds.length);

      setEditParticipant(null);
      resetForm();
      form.reset();
      setPreviewImage(null);
      setSuccessMessage(`Participant updated successfully! ${votesToAdd > 0 ? `Added ${newTransactionIds.length} votes.` : ''}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: `Failed to update participant: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (docId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this participant? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await deleteParticipant(db, docId, setErrors);
        setSuccessMessage('Participant deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrors({ submission: 'Failed to delete participant' });
      }
    }
  };

  return (
    <>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {participantsError && <div className="alert alert-danger">{participantsError}</div>}
      {errors.submission && <div className="alert alert-danger">{errors.submission}</div>}
      <ParticipantTable
        participants={participants}
        handleEditParticipant={handleEditParticipant}
        handleDeleteParticipant={handleDeleteParticipant}
        handleViewVotes={handleViewVotes}
        isSubmitting={isSubmitting}
      />
      <ParticipantForm
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        previewImage={previewImage}
        handleSubmit={editParticipant ? handleUpdateParticipant : handleAddParticipant}
        isEditing={!!editParticipant}
        editParticipant={editParticipant}
        resetForm={resetForm}
        setEditParticipant={setEditParticipant}
        setPreviewImage={setPreviewImage}
      />
      <VotesModal
        show={showVotesModal}
        onHide={() => setShowVotesModal(false)}
        participant={currentParticipant}
        voters={currentVoters}
      />
    </>
  );
};

export default ParticipantManager;
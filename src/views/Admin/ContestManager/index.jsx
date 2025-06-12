// src/components/ContestManager/ContestManager.jsx
import React from 'react';
import { useContestManager } from '../../../hooks/useContestManager';
import ContestForm from './ContestForm';
import ContestList from './ContestList';
import AddParticipantModal from './AddParticipantModal';
import ViewParticipantsModal from './ViewParticipantsModal';
import AddVotesModal from './AddVotesModal';

const ContestManager = ({ setContestId }) => {
  const {
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
  } = useContestManager(setContestId);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{editContest ? 'Edit Contest' : 'Create Contest'}</h5>
      </div>
      <div className="card-body">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {(errors.submission || errors.fetch || errors.fetchParticipants || apiError) && (
          <div className="alert alert-danger">
            {errors.submission || errors.fetch || errors.fetchParticipants || apiError}
          </div>
        )}

        {!showForm && (
          <div className="mb-3">
            <button className="btn btn-primary" onClick={handleAddContest} disabled={isSubmitting || loading}>
              Add Contest
            </button>
          </div>
        )}

        {showForm && (
          <ContestForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            loading={loading}
            editContest={editContest}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            handleContestSubmit={handleContestSubmit}
            handleResetContest={handleResetContest}
            setShowForm={setShowForm}
          />
        )}

        <ContestList
          contests={contests}
          isSubmitting={isSubmitting}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSelectContest={handleSelectContest}
          handleAddParticipant={handleAddParticipant}
          handleViewParticipants={handleViewParticipants}
        />

        <AddParticipantModal
          showAddParticipantModal={showAddParticipantModal}
          participantFormData={participantFormData}
          errors={errors}
          isSubmitting={isSubmitting}
          loading={loading}
          handleParticipantChange={handleParticipantChange}
          handleParticipantSubmit={handleParticipantSubmit}
          handleResetParticipant={handleResetParticipant}
          setShowAddParticipantModal={setShowAddParticipantModal}
        />

        <ViewParticipantsModal
          showViewParticipantsModal={showViewParticipantsModal}
          participants={participants}
          isSubmitting={isSubmitting}
          loading={loading}
          setShowViewParticipantsModal={setShowViewParticipantsModal}
          handleAddVotes={handleAddVotes}
          selectedContestId={selectedContestId}
        />

        <AddVotesModal
          showAddVotesModal={showAddVotesModal}
          voteFormData={voteFormData}
          errors={errors}
          isSubmitting={isSubmitting}
          loading={loading}
          handleVoteChange={handleVoteChange}
          handleVoteSubmit={handleVoteSubmit}
          handleResetVotes={handleResetVotes}
          setShowAddVotesModal={setShowAddVotesModal}
        />
      </div>
    </div>
  );
};

export default ContestManager;
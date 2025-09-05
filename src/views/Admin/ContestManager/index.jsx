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
    handleDeleteParticipant,
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
    handleEvictParticipant, // Add this
  } = useContestManager(setContestId);

  console.log('ContestManager modals:', { showAddParticipantModal, showAddVotesModal, showViewParticipantsModal });

  return (
    <div className="contest-manager">
      <div className="card">
        <div className="card-header">
          <h5>{editContest ? 'Edit Bootcamp' : 'Create Bootcamp'}</h5>
        </div>
        <div className="card-body">
          {successMessage && <div className="alert-success">{successMessage}</div>}
          {(errors.submission || errors.fetch || errors.fetchParticipants || apiError) && (
            <div className="alert-error">
              {errors.submission || errors.fetch || errors.fetchParticipants || apiError}
            </div>
          )}

          {!showForm && (
            <div style={{ marginBottom: '16px' }}>
              <button
                className="add-workshop-btn"
                onClick={handleAddContest}
                disabled={isSubmitting || loading}
                aria-label="Add new bootcamp"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Bootcamp
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
            handleReset OSA Participant={handleResetParticipant}
            setShowAddParticipantModal={setShowAddParticipantModal}
          />

          <ViewParticipantsModal
                  handleDeleteParticipant={handleDeleteParticipant}
            showViewParticipantsModal={showViewParticipantsModal}
            participants={participants}
            isSubmitting={isSubmitting}
            loading={loading}
            setShowViewParticipantsModal={setShowViewParticipantsModal}
            handleAddVotes={handleAddVotes}
            selectedContestId={selectedContestId}
            handleEvictParticipant={handleEvictParticipant} // Pass the handler
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
    </div>
  );
};

export default ContestManager;
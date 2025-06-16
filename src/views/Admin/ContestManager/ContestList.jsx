// src/components/ContestManager/ContestList.jsx
import React from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiUsers } from 'react-icons/fi';

const ContestList = ({
  contests,
  isSubmitting,
  loading,
  handleEdit,
  handleDelete,
  handleAddParticipant,
  handleViewParticipants,
}) => {
  console.log('ContestList render:', {
    isSubmitting,
    loading,
    contests,
    handlers: { handleEdit, handleDelete, handleAddParticipant, handleViewParticipants },
  });

  return (
    <div className="contest-list-container">
      <h5>Workshop List</h5>
      {contests.length === 0 ? (
        <p>No contests available. Create one to start managing participants.</p>
      ) : (
        <div className="participants-grid">
          {contests.map((contest) => (
            <div key={contest.id} className="participant-card">
              <div className="participant-details">
                <h3>{contest.name}</h3>
                <p><strong>Start Date:</strong> {new Date(contest.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(contest.endDate).toLocaleDateString()}</p>
                <div className="action-buttons">
                  <button
                    className="action-icon edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit clicked for contest:', contest.id);
                      if (handleEdit) handleEdit(contest);
                      else console.error('handleEdit is undefined');
                    }}
                    disabled={isSubmitting || loading}
                    aria-label="Edit contest"
                    title="Edit Contest"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="action-icon delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Delete clicked for contest:', contest.id);
                      if (handleDelete) handleDelete(contest.id);
                      else console.error('handleDelete is undefined');
                    }}
                    disabled={isSubmitting || loading}
                    aria-label="Delete contest"
                    title="Delete Contest"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    className="action-icon add-participant-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add Participant clicked for contest:', contest.id);
                      if (handleAddParticipant) handleAddParticipant(contest.id);
                      else console.error('handleAddParticipant is undefined');
                    }}
                    disabled={isSubmitting || loading}
                    aria-label="Add participant"
                    title="Add Participant"
                  >
                    <FiUserPlus />
                  </button>
                  <button
                    className="action-icon view-participants-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View Participants clicked for contest:', contest.id);
                      if (handleViewParticipants) handleViewParticipants(contest.id);
                      else console.error('handleViewParticipants is undefined');
                    }}
                    disabled={isSubmitting || loading}
                    aria-label="View participants"
                    title="View Participants"
                  >
                    <FiUsers />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestList;
import React, { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi';
import bgImage from '../../assets/images/voting.png';
import { v4 as uuidv4 } from 'uuid';

function PageantVotingPage() {
  const { request, loading: apiLoading, error: apiError } = useApi();
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [voterDetails, setVoterDetails] = useState({
    voterName: '',
    email: '',
    voteCount: 1,
  });
  const [formErrors, setFormErrors] = useState({});
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Check if Paystack script is loaded
  useEffect(() => {
    const checkPaystack = () => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        console.log('Paystack loaded');
      } else {
        setTimeout(checkPaystack, 100);
      }
    };
    checkPaystack();
  }, []);

  // Fetch contests and participants
  const fetchContestsAndParticipants = async () => {
    setIsLoading(true);
    console.log('VITE_CONTEST_ENDPOINT:', import.meta.env.VITE_CONTEST_ENDPOINT);
    console.log('Starting fetchContestsAndParticipants');
    try {
      const response = await request({
        url: import.meta.env.VITE_CONTEST_ENDPOINT, // e.g., http://localhost:3000/contests
        method: 'GET',
      });
      console.log('Raw API response:', JSON.stringify(response, null, 2));

      // Handle unexpected response structure
      const data = Array.isArray(response) ? response : response?.contests || [];
      console.log('Processed contests:', JSON.stringify(data, null, 2));

      const contestsWithParticipants = [];
      for (const contest of data) {
        console.log(`Fetching participants for contest ${contest.id}`);
        try {
          const participantsData = await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contest.id}/participants`,
            method: 'GET',
          });
          console.log(`Participants for contest ${contest.id}:`, participantsData);

          // Filter participants to only include those with evicted: false
          const formattedParticipants = (Array.isArray(participantsData) ? participantsData : [])
            .filter((participant) => participant.evicted === false)
            .map((participant) => ({
              codeName: participant.codeName || '',
              fullName: participant.fullName || 'Unknown',
              about: participant.about || 'No bio available',
              photo: participant.photo || 'https://via.placeholder.com/800x600?text=No+Image',
              votes: Array.isArray(participant.votes) ? participant.votes : [],
            }));

          contestsWithParticipants.push({
            ...contest,
            participants: formattedParticipants,
          });
        } catch (err) {
          console.error(`Error fetching participants for contest ${contest.id}:`, err);
          contestsWithParticipants.push({
            ...contest,
            participants: [],
            error: 'participants cannot be fetched, something went wrong',
          });
        }
      }

      // Filter active contests (endDate >= current date)
      const currentDate = new Date();
      const activeContests = contestsWithParticipants.filter(
        (contest) => new Date(contest.endDate) >= currentDate
      );
      console.log('Active contests:', JSON.stringify(activeContests, null, 2));

      setContests(activeContests);
      if (activeContests.length === 0) {
        setMessage('No active contests found.');
      }
    } catch (err) {
      console.error('Error fetching contests:', err);
      setMessage('participants cannot be fetched, something went wrong');
    } finally {
      setIsLoading(false);
      console.log('Finished fetchContestsAndParticipants, isLoading:', false);
    }
  };

  useEffect(() => {
    fetchContestsAndParticipants();
  }, [request]);

  const openVoteModal = (participant, contestId) => {
    setSelectedParticipant(participant);
    setSelectedContestId(contestId);
    setVoterDetails({ voterName: '', email: '', voteCount: 1 });
    setFormErrors({});
    setShowModal(true);
  };

  const handleVoterInputChange = (e) => {
    const { name, value } = e.target;
    setVoterDetails({
      ...voterDetails,
      [name]: name === 'voteCount' ? parseInt(value) || '' : value,
    });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateVoterForm = () => {
    const errors = {};
    if (!voterDetails.voterName.trim()) {
      errors.voterName = 'Full name is required';
    }
    if (!voterDetails.email || !voterDetails.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (
      !voterDetails.voteCount ||
      isNaN(voterDetails.voteCount) ||
      voterDetails.voteCount < 1
    ) {
      errors.voteCount = 'Vote count must be a positive integer';
    }
    return errors;
  };

  const saveVote = async (
    response,
    voterName,
    email,
    voteCount,
    participant,
    contestId
  ) => {
    console.log('Saving vote:', { voterName, email, voteCount, participant, contestId });
    try {
      await request({
        url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/votes`,
        method: 'POST',
        data: {
          participantCodeName: participant.codeName,
          voteCount,
          email,
          voterName,
          paymentReference: response.reference,
        },
      });
      console.log('Vote saved successfully');

      setContests((prev) =>
        prev.map((contest) =>
          contest.id === contestId
            ? {
                ...contest,
                participants: contest.participants.map((p) =>
                  p.codeName === participant.codeName
                    ? {
                        ...p,
                        votes: [
                          ...p.votes,
                          { voterName, voteCount, paymentReference: response.reference },
                        ],
                      }
                    : p
                ),
              }
            : contest
        )
      );
      setUserVotes((prev) => ({ ...prev, [participant.codeName]: true }));
      setMessage('Thank you for voting!');
    } catch (error) {
      console.error('Error saving vote:', error);
      setMessage('participants cannot be fetched, something went wrong');
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    const errors = validateVoterForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedParticipant || !selectedContestId) {
      setMessage('Invalid participant or contest selected.');
      return;
    }

    const { voterName, email, voteCount } = voterDetails;
    const participant = selectedParticipant;
    const contestId = selectedContestId;

    if (userVotes[participant.codeName]) {
      setMessage('You’ve already voted for this contestant today.');
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      console.error('PaystackPop is not loaded.');
      setMessage('Paystack failed to load. Please refresh the page.');
      return;
    }

    const reference = `VOTE_${uuidv4()}`;
    console.log('Initiating Paystack payment:', { reference, email, amount: voteCount * 50 * 100 });

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_KEY,
        email,
        amount: voteCount * 50 * 100, // 50 Naira per vote, in kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          contestId,
          participantCodeName: participant.codeName,
          voteCount,
          voterName,
        },
        callback: (response) => {
          console.log('Paystack callback:', response);
          saveVote(response, voterName, email, voteCount, participant, contestId);
          setShowModal(false);
          setTimeout(() => setMessage(null), 3000);
        },
        onClose: () => {
          console.log('Paystack payment canceled');
          setMessage('Payment was canceled.');
          setShowModal(false);
          setTimeout(() => setMessage(null), 3000);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setMessage('participants cannot be fetched, something went wrong');
    }
  };

  return (
    <div className="pageant-voting-page">
      <div
        className="voting-banner"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="voting-banner-overlay">
          <h1>Vote for Your Favorite Contestant</h1>
          <p>Support your favorite fashion designer by casting your vote!</p>
        </div>
      </div>

      <div className="container voting-container" data-aos="fade-up">
        <div className="section_voting_title">
          <h2>Active Contests</h2>
        </div>

        {(isLoading || apiLoading) && <div className="loading">Loading contests...</div>}
        {message && <div className="vote-message">{message}</div>}
        {/* Remove direct apiError display */}
        {/* {apiError && <div className="vote-message">{apiError}</div>} */}

        {!isLoading && contests.length === 0 && (
          <p>No active contests found. Please check back later.</p>
        )}

        {!isLoading && contests.length > 0 && (
          <div>
            {contests.map((contest) => (
              <div key={contest.id} className="contest-section mb-5">
                <h3 className="contest-title">{contest.name}</h3>
                {contest.error && (
                  <div className="text-danger">{contest.error}</div>
                )}
                {Array.isArray(contest.participants) && contest.participants.length === 0 && !contest.error ? (
                  <p>No active participants found for this contest.</p>
                ) : (
                  Array.isArray(contest.participants) && (
                    <div className="row">
                      {contest.participants.map((participant, index) => (
                        <div
                          key={participant.codeName}
                          className="col-md-4 contestant-card"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                          style={{ marginBottom: '20px' }}
                        >
                          <div className="contestant-image">
                            <img
                              src={participant.photo}
                              alt={participant.fullName}
                              onError={(e) => {
                                e.target.src =
                                  'https://via.placeholder.com/800x600?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="contestant-details">
                            <h4>{participant.fullName}</h4>
                            <p>{participant.about}</p>
                            <div className="vote-count">
                              <span>
                                {participant.votes.reduce(
                                  (sum, vote) => sum + (vote.voteCount || 0),
                                  0
                                )}{' '}
                                Votes
                              </span>
                            </div>
                            <button
                              className="red_button vote-button"
                              onClick={() => openVoteModal(participant, contest.id)}
                              disabled={apiLoading || !paystackLoaded}
                            >
                              Vote Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        <div className="voting-info">
          <p>
            Voting is open daily until the end of each contest. Each vote costs ₦50.
            Results will be announced after each contest ends.
          </p>
          <div className="red_button shop_now_button">
            <a href="/workshop">Learn More</a>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="voteModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="voteModalLabel">
                  Vote for {selectedParticipant?.fullName || 'Contestant'}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleVote}>
                  <div className="form-group">
                    <label htmlFor="voterName">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="voterName"
                      name="voterName"
                      value={voterDetails.voterName}
                      onChange={handleVoterInputChange}
                      placeholder="Enter your full name"
                    />
                    {formErrors.voterName && (
                      <span className="error">{formErrors.voterName}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={voterDetails.email}
                      onChange={handleVoterInputChange}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <span className="error">{formErrors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="voteCount">Number of Votes</label>
                    <input
                      type="number"
                      className="form-control"
                      id="voteCount"
                      name="voteCount"
                      value={voterDetails.voteCount}
                      onChange={handleVoterInputChange}
                      placeholder="Enter number of votes"
                      min="1"
                    />
                    {formErrors.voteCount && (
                      <span className="error">{formErrors.voteCount}</span>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="red_button vote-button"
                      disabled={apiLoading || !paystackLoaded}
                    >
                      Vote
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default PageantVotingPage;
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  getDoc,
} from "firebase/firestore";
import "../../assets/css/style.css";
import "../../assets/css/responsive.css";
import { db } from "../../firebase/config";
import bgImage from "../../assets/images/voting.png";

function PageantVotingPage() {
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [voterDetails, setVoterDetails] = useState({
    fullName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch participants from Firestore
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "participants"));
      const data = snapshot.docs.map((doc) => {
        const participantData = {
          firestoreDocId: doc.id,
          docId: doc.id,
          ...doc.data(),
          // Normalize fields with defaults
          uid: doc.data().uid || doc.id, // Use doc.id if uid is missing
          stageName: doc.data().stageName || doc.data().codeName || "Unknown",
          bio: doc.data().bio || doc.data().about || "No bio available",
          photoURL: doc.data().photoURL || "https://via.placeholder.com/800x600?text=No+Image",
          voters: Array.isArray(doc.data().voters) ? doc.data().voters : [],
        };
        return participantData;
      });
      console.log("Fetched participants:", JSON.stringify(data, null, 3));
      setParticipants(data); // Include all participants, no status filter
      if (data.length === 0) {
        setMessage("No participants found in the collection.");
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
      setMessage(`Failed to load participants: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Handle modal open
  const openVoteModal = (participant) => {
    setSelectedParticipant(participant);
    setVoterDetails({ fullName: "", email: "" });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle modal form input changes
  const handleVoterInputChange = (e) => {
    const { name, value } = e.target;
    setVoterDetails({
      ...voterDetails,
      [name]: value,
    });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  // Validate modal form
  const validateVoterForm = () => {
    const errors = {};
    if (!voterDetails.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!voterDetails.email || !voterDetails.email.includes("@")) {
      errors.email = "Valid email is required";
    }
    return errors;
  };

  // Handle voting + Paystack payment
  const handleVote = async (e) => {
    e.preventDefault();
    const errors = validateVoterForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const { fullName, email } = voterDetails;
    const participant = selectedParticipant;

    if (!window.PaystackPop) {
      console.error("PaystackPop is not defined. Ensure the Paystack script is loaded.");
      setMessage("Paystack failed to load. Please refresh the page.");
      return;
    }

    if (userVotes[participant.uid]) {
      setMessage("You've already voted for this contestant today.");
      return;
    }

    if (!participant.firestoreDocId) {
      console.error("Invalid participant: firestoreDocId is undefined", participant);
      setMessage("Invalid participant data. Please contact support.");
      return;
    }

    const processVote = async (response) => {
      const voteData = {
        fullName,
        email,
        contestantId: participant.uid,
        timestamp: new Date(),
        transactionId: response.reference,
      };

      try {
        // Save vote
        await addDoc(collection(db, "votes"), voteData);

        // Update participant voters array
        const participantRef = doc(db, "participants", participant.firestoreDocId);
        const participantDoc = await getDoc(participantRef);

        if (participantDoc.exists()) {
          const participantData = participantDoc.data();
          console.log("Participant data:", JSON.stringify(participantData, null, 3));

          // Ensure voters is an array
          if (!Array.isArray(participantData.voters)) {
            console.log("Voters field is not an array, initializing as empty array");
            await updateDoc(participantRef, {
              voters: [],
            });
          }

          // Perform the arrayUnion operation
          await updateDoc(participantRef, {
            voters: arrayUnion(email),
          });

          // Update the participants state
          setParticipants((prevParticipants) =>
            prevParticipants.map((p) =>
              p.firestoreDocId === participant.firestoreDocId
                ? {
                    ...p,
                    voters: Array.isArray(p.voters) && !p.voters.includes(email)
                      ? [...p.voters, email]
                      : [email],
                  }
                : p
            )
          );

          setUserVotes({ ...userVotes, [participant.uid]: true });
          setMessage("Thank you for voting!");
          setShowModal(false);
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage("Participant not found. Please contact support.");
          console.error("Document does not exist:", participant.firestoreDocId);
          await addDoc(collection(db, "failed_votes"), {
            fullName,
            email,
            contestantId: participant.uid,
            transactionId: response.reference,
            error: "Participant document not found",
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Vote save error:", error);
        setMessage("Payment went through, but vote wasn't recorded. Contact support.");
        await addDoc(collection(db, "failed_votes"), {
          fullName,
          email,
          contestantId: participant.uid,
          transactionId: response.reference,
          error: error.message,
          timestamp: new Date(),
        });
      }
    };

    const paystackKey = import.meta.env.VITE_PAYSTACK_KEY;
    if (!paystackKey) {
      console.error("Paystack key is not defined in environment variables.");
      setMessage("Payment configuration error. Please contact support.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: email,
      amount: 5000,
      currency: "NGN",
      ref: `VOTE-${new Date().getTime()}`,
      callback: function (response) {
        console.log("Paystack callback response:", response);
        processVote(response);
      },
      onClose: function () {
        setMessage("Payment was canceled.");
        setShowModal(false);
        setTimeout(() => setMessage(""), 3000);
      },
    });

    handler.openIframe();
  };

  return (
    <div className="pageant-voting-page">
      {/* Fixed Background Banner */}
      <div
        className="voting-banner"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="voting-banner-overlay">
          <h1>Vote for Your Favorite Contestant</h1>
          <p>Support your favorite fashion designer by casting your vote!</p>
        </div>
      </div>

      {/* Voting Section */}
      <div className="container voting-container" data-aos="fade-up">
        <div className="section_voting_title">
          <h2>Meet the Contestants</h2>
        </div>

        {loading && <div className="loading">Loading contestants...</div>}
        {message && <div className="vote-message">{message}</div>}

        <div className="row">
          {participants.length === 0 && !loading && (
            <p>No contestants found. Please check back later.</p>
          )}
          {participants.map((participant, index) => {
            console.log("Rendering participant:", participant);
            return (
              <div
                key={participant.uid}
                className="col-md-4 contestant-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="contestant-image">
                  <img
                    src={participant.photoURL}
                    alt={participant.stageName}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                    }}
                  />
                </div>
                <div className="contestant-details">
                  <h4>{participant.stageName}</h4>
                  <p>{participant.bio}</p>
                  <div className="vote-count">
                    <span>{participant.voters?.length || 0} Votes</span>
                  </div>
                  <button
                    className="red_button vote-button"
                    onClick={() => openVoteModal(participant)}
                    disabled={loading}
                  >
                    Vote Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="voting-info">
          <p>
            Voting is open daily until the end of the month. You can vote multiple
            times — each vote costs ₦50. Results will be announced on the 1st of next
            month.
          </p>
          <div className="red_button shop_now_button">
            <a href="/pageant">Learn More</a>
          </div>
        </div>
      </div>

      {/* Voting Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="voteModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="voteModalLabel">
                  Vote for {selectedParticipant?.stageName || "Contestant"}
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
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={voterDetails.fullName}
                      onChange={handleVoterInputChange}
                      placeholder="Enter your full name"
                    />
                    {formErrors.fullName && (
                      <span className="error">{formErrors.fullName}</span>
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
                      disabled={loading}
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
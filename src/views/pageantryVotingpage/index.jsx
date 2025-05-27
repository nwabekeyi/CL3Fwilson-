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
import { db } from "../../firebase/config";

function PageantVotingPage() {
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [userVotes, setUserVotes] = useState({});

  // Fetch participants from Firestore
  const fetchParticipants = async () => {
    try {
      const snapshot = await getDocs(collection(db, "participants"));
      const data = snapshot.docs.map((doc) => {
        const participantData = {
          firestoreDocId: doc.id, // Set to ira8nhkOEZOvSkjWTnHZ
          ...doc.data(),
          docId: doc.id, // Override docId with Firestore document ID
        };
        // Ensure voters is an array
        participantData.voters = Array.isArray(participantData.voters) ? participantData.voters : [];
        return participantData;
      });
      console.log("Fetched participants:", JSON.stringify(data, null, 2));
      setParticipants(data.filter((p) => p.status === "active"));
    } catch (err) {
      console.error("Error fetching participants:", err);
      setMessage("Failed to load participants. Please try again later.");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // Handle voting + Paystack payment
  const handleVote = (participant) => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email before voting.");
      return;
    }

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
        email,
        contestantId: participant.uid,
        timestamp: new Date(),
        transactionId: response.reference,
      };

      try {
        // Save vote
        await addDoc(collection(db, "votes"), voteData);

        // Log the document ID being used
        console.log("Attempting to update document ID:", participant.firestoreDocId);

        // Update participant voters array
        const participantRef = doc(db, "participants", participant.firestoreDocId);
        const participantDoc = await getDoc(participantRef);

        if (participantDoc.exists()) {
          const participantData = participantDoc.data();
          console.log("Participant data:", JSON.stringify(participantData, null, 2));
          console.log("Voters field type:", Array.isArray(participantData.voters) ? "Array" : typeof participantData.voters);

          // Ensure voters is an array
          if (!Array.isArray(participantData.voters)) {
            console.log("Voters field is not an array, initializing as empty array");
            await updateDoc(participantRef, {
              voters: [], // Initialize as empty array
            });
          }

          // Perform the arrayUnion operation
          await updateDoc(participantRef, {
            voters: arrayUnion(email),
          });

          // Update the participants state to reflect the new voter
          setParticipants((prevParticipants) =>
            prevParticipants.map((p) =>
              p.firestoreDocId === participant.firestoreDocId
                ? {
                    ...p,
                    voters: Array.isArray(p.voters) && !p.voters.includes(email)
                      ? [...p.voters, email]
                      : p.voters,
                  }
                : p
            )
          );

          setUserVotes({ ...userVotes, [participant.uid]: true });
          setMessage("Thank you for voting!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage("Participant not found. Please contact support.");
          console.error("Document does not exist:", participant.firestoreDocId);
          await addDoc(collection(db, "failed_votes"), {
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
          backgroundImage: `url(https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
        }}
      >
        <div className="voting-banner-overlay">
          <h1>Vote for Your Favorite Contestant</h1>
          <p>Support your favorite fashion designer by casting your vote!</p>
        </div>
      </div>

      {/* Voting Section */}
      <div className="container voting-container" data-aos="fade-up">
        <div className="section_title">
          <h2>Meet the Contestants</h2>
        </div>

        {/* Email input for voting */}
        <div className="email-input-box">
          <input
            type="email"
            placeholder="Enter your email to vote"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <div className="vote-message">{message}</div>}

        <div className="row">
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
                  <img src={participant.photoURL} alt={participant.stageName} />
                </div>
                <div className="contestant-details">
                  <h4>{participant.stageName}</h4>
                  <p>{participant.bio}</p>
                  <div className="vote-count">
                    <span>{participant.voters?.length || 0} Votes</span>
                  </div>
                  <button
                    className="red_button vote-button"
                    onClick={() => handleVote(participant)}
                  >
                    Vote Now (₦50)
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
            <a href="/pageant">Learn More About the Pageant</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageantVotingPage;
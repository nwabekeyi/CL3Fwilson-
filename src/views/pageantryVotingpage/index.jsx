import React, { useState } from "react";

function PageantVotingPage() {
  // Dummy contestant data with initial vote counts and Unsplash image URLs
  const [contestants, setContestants] = useState([
    {
      id: 1,
      name: "Chidi Okeke",
      photo: "https://images.unsplash.com/photo-1610652492500-2d6cb4b0f6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "A Lagos-based stylist with a flair for bold suits and vibrant accessories.",
      votes: 1250,
    },
    {
      id: 2,
      name: "Tunde Adebayo",
      photo: "https://images.unsplash.com/photo-1618375533152-6d57ca4e30c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "An Abuja entrepreneur who blends classic and streetwear fashion effortlessly.",
      votes: 980,
    },
    {
      id: 3,
      name: "Emeka Nwosu",
      photo: "https://images.unsplash.com/photo-1623937443846-2f7b0d1116f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "A Port Harcourt model passionate about sustainable fashion and minimalist style.",
      votes: 1500,
    },
  ]);

  // State to track user votes (simulates one vote per user per day)
  const [userVotes, setUserVotes] = useState({});
  const [message, setMessage] = useState("");

  // Handle voting
  const handleVote = (contestantId) => {
    // Simulate checking if user has already voted today
    if (userVotes[contestantId]) {
      setMessage("You’ve already voted for this contestant today! Try again tomorrow.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Increment votes
    setContestants(
      contestants.map((contestant) =>
        contestant.id === contestantId
          ? { ...contestant, votes: contestant.votes + 1 }
          : contestant
      )
    );

    // Record user vote (in a real app, this would use auth and backend)
    setUserVotes({ ...userVotes, [contestantId]: true });
    setMessage("Thank you for voting!");
    setTimeout(() => setMessage(""), 3000);
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
        {message && <div className="vote-message">{message}</div>}
        <div className="row">
          {contestants.map((contestant) => (
            <div
              key={contestant.id}
              className="col-md-4 contestant-card"
              data-aos="fade-up"
              data-aos-delay={contestant.id * 100}
            >
              <div className="contestant-image">
                <img src={contestant.photo} alt={contestant.name} />
              </div>
              <div className="contestant-details">
                <h4>{contestant.name}</h4>
                <p>{contestant.bio}</p>
                <div className="vote-count">
                  <span>{contestant.votes.toLocaleString()} Votes</span>
                </div>
                <button
                  className="red_button vote-button"
                  onClick={() => handleVote(contestant.id)}
                  disabled={userVotes[contestant.id]}
                >
                  Vote Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="voting-info">
          <p>
            Voting is open daily until the end of the month. You can vote once per
            day per contestant. Results will be announced on the 1st of next month.
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
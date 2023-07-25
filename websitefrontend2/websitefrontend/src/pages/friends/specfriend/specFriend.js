import React, { useState, useEffect } from 'react';

const specFriend = ({ userId, friendId }) => {
  const [friendData, setFriendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await fetch(`/api/${userId}/friends/${friendId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFriendData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchFriendData();
  }, [userId, friendId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Friend Details</h1>
      {friendData ? (
        <div className="friend-card">
          <h2>{friendData.name}</h2>
          <p>{friendData.email}</p>
        </div>
      ) : (
        <p>Friend not found.</p>
      )}
    </div>
  );
};

export default specFriend;
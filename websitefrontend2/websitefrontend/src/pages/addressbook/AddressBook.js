import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const AddressBook = () => {
  const [addressBookData, setAddressBookData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  const { user } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/addressBook');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAddressBookData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleViewProfileClick = (username) =>{
    history.push({
      pathname: '/userProfile',
      state: { profileUsername: username }
    });
  };

  const handleAddFriendClick = (username) =>  {
    fetch(`/api/friendreqs/${user.appUserID}/sendFriendRequestByUsername/${username}`);

    if(isLoading){
      return <div>Loading...</div>
    }
    if(error){
      return <div>Error: {error}</div>
    }

  }
  const filteredUsers = searchTerm
    ? addressBookData.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : addressBookData;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      {user && <p>Logged in as: {user.username}</p>}
      <p>{addressBookData && addressBookData.message}</p>
      {user && (
        <>
          <h2>Website Users</h2>
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {filteredUsers && filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map(user => ( 
                <li key={user.appUserID}>
                  {user.username} - {user.firstname} {user.lastname}
                  <button onClick={handleViewProfileClick}>View Profile</button>
                  <button onClick={handleAddFriendClick(user.username)}>Add Friend</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No website users found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AddressBook;
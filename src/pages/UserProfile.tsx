import React from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      {/* We'll add user stats and game history here */}
    </div>
  );
}

export default UserProfile; 

import React from 'react';

function ProtectedPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to the Protected Page!</h2>
      <p>You are verified and authenticated. 🎉</p>
    </div>
  );
}

export default ProtectedPage;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Loginpage';
import ProtectedPage from './ProtectedPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/protected"
          element={
            isAuthenticated ? <ProtectedPage /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

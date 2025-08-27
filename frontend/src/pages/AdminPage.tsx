// frontend/src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // For fetching protected data

interface AdminData {
  message: string;
  users?: any[]; // Example: a list of users
}

const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoadingData(true);
        // Example: Fetch data from a protected backend endpoint requiring admin role
        // This assumes you have a protected route like /api/admin on your backend
        const response = await axios.get('http://localhost:5000/api/auth/admin'); // Using the example /admin route
        setAdminData(response.data);
      } catch (error: any) {
        console.error('Failed to fetch admin data:', error);
        setErrorData(error.response?.data?.message || 'Failed to load admin data.');
      } finally {
        setLoadingData(false);
      }
    };

    // Only fetch if authenticated and has admin role
    if (token && user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoadingData(false); // If not admin, stop loading and show no data
      setErrorData('You do not have administrative access.');
    }
  }, [token, user]);


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Admin Page</h1>
      {user && <p>Welcome, Admin {user.name || user.email}!</p>}

      {loadingData ? (
        <p>Loading admin data...</p>
      ) : errorData ? (
        <p style={{ color: 'red' }}>Error: {errorData}</p>
      ) : adminData ? (
        <div>
          <h2>Admin Data:</h2>
          <p>{adminData.message}</p>
          {/* Render other admin-specific data here, e.g., a list of users */}
          {adminData.users && (
            <div>
              <h3>User List:</h3>
              <ul>
                {adminData.users.map((u: any) => (
                  <li key={u._id}>{u.name} ({u.email}) - {u.role}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No admin data to display.</p>
      )}

      {/* Add more admin specific content here */}
    </div>
  );
};

export default AdminPage;
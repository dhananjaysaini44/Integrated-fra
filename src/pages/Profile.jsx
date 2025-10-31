import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import authService from '../services/authService';

const Profile = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    phone: '',
    village: '',
    role: authUser?.role || '',
    state: authUser?.state || '',
    gram_panchayat_id: authUser?.gram_panchayat_id || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Initialize user data from auth state
  useEffect(() => {
    if (authUser) {
      const userData = {
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        village: authUser.village || '',
        role: authUser.role || '',
        state: authUser.state || '',
        gram_panchayat_id: authUser.gram_panchayat_id || ''
      };
      setUser(userData);
      setFormData(userData);
    }
  }, [authUser]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    if (!authUser?.id) {
      showNotification('Unable to update profile: User ID not found', 'error');
      return;
    }

    setLoading(true);
    try {
      const gpid = String(formData.gram_panchayat_id || '').trim();
      if (!gpid) {
        showNotification('Gram Panchayat ID is required', 'error');
        setLoading(false);
        return;
      }
      if (!/^[A-Za-z0-9]+$/.test(gpid) || gpid.length < 10) {
        showNotification('Gram Panchayat ID must be alphanumeric and at least 10 characters long', 'error');
        setLoading(false);
        return;
      }
      const updatedUser = await authService.updateProfile({ ...formData, gram_panchayat_id: gpid });
      setUser({ ...formData, gram_panchayat_id: gpid });
      
      // Update Redux state with the new user data
      const token = localStorage.getItem('token');
      dispatch(loginSuccess({ user: updatedUser, token }));
      
      setIsEditing(false);
      showNotification('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific error types
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        showNotification('Session expired. Please log in again.', 'error');
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        showNotification('You do not have permission to update this profile.', 'error');
      } else {
        showNotification(error.message || 'Failed to update profile', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="text-lg">{user.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="text-lg">{user.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="text-lg">{user.phone}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Village</label>
          {isEditing ? (
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your village"
            />
          ) : (
            <p className="text-lg">{user.village || 'Not specified'}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gram Panchayat ID</label>
          {isEditing ? (
            <input
              type="text"
              name="gram_panchayat_id"
              value={formData.gram_panchayat_id || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Alphanumeric, min 10 characters"
            />
          ) : (
            <p className="text-lg">{user.gram_panchayat_id || 'Not specified'}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          {isEditing ? (
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select State</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Tripura">Tripura</option>
              <option value="Odisha">Odisha</option>
              <option value="Telangana">Telangana</option>
            </select>
          ) : (
            <p className="text-lg">{user.state || 'Not specified'}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <p className="text-lg">{user.role || 'Not specified'}</p>
        </div>

        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                }} 
                disabled={loading}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

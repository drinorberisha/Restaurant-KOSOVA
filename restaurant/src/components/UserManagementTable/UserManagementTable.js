import { fetchAllUsers, updateUser, addNewUser } from '@/utils/api';
import React, { useState, useEffect } from 'react';

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    role: '',
    status: 'active',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.user_id);
    setEditFormData({ ...user });
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleFinishEdit = async () => {
    try {
      await updateUser(editingUserId, editFormData);
      const updatedUsers = users.map((user) =>
        user.user_id === editingUserId ? { ...editFormData } : user
      );
      setUsers(updatedUsers);
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      if (value.length <= 4) {
        setNewUserData((prevData) => ({ ...prevData, [name]: value }));
        setPasswordError(''); // Clear error if input is valid
      } else {
        setPasswordError('Password must be 4 digits only');
      }
    } else {
      setNewUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Function to submit new user d
  const handleAddNewUser = async () => {
    try {
      if (newUserData.password.length !== 4) {
        setPasswordError('Password must be exactly 4 digits');
        return;
      }
      setPasswordError('');
      await addNewUser(newUserData);
      // Reset the form and fetch updated user list
      setShowAddForm(false);
      setNewUserData({ ...initialUserData });
      loadUsers();
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  };

  const renderTableCell = (user, field, isEditing) => {
    // Set common styles for both editable and non-editable cells
    const cellStyle = 'border text-center border-gray-400 p-1';
    const inputStyle = 'w-full h-full text-center';

    // If in edit mode, return an input field or a select dropdown
    if (isEditing) {
      // Check if the field should be a select dropdown
      if (field === 'role' || field === 'status') {
        let options;
        if (field === 'role') {
          // Define role options
          options = ['admin', 'manager', 'waiter']; // Add more roles as needed
        } else if (field === 'status') {
          // Define status options
          options = ['active', 'passive']; // Add more statuses as needed
        }

        return (
          <td className={cellStyle}>
            <select
              name={field}
              value={editFormData[field]}
              onChange={handleEditFormChange}
              className={inputStyle}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </td>
        );
      } else {
        // For other fields, use an input
        return (
          <td className={cellStyle}>
            <input
              type={field === 'password' ? 'number' : 'text'}
              name={field}
              value={editFormData[field]}
              onChange={handleEditFormChange}
              className={inputStyle}
              style={{
                maxWidth: '100%',
                padding: '0',
                lineHeight: '1.5',
                boxSizing: 'border-box',
              }}
            />
          </td>
        );
      }
    } else {
      // If not in edit mode, display the text
      return (
        <td className={cellStyle}>
          <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user[field]}
          </span>
        </td>
      );
    }
  };

  return (
    <div
      className="table-container"
      style={{ height: '70vh', overflowY: 'auto' }}
    >
      <table className="border-collapse w-full" style={{ width: '135vh' }}>
        <thead>
          <tr>
            <th className="border border-gray-400">First Name</th>
            <th className="border border-gray-400">Last name</th>
            <th className="border border-gray-400">Username</th>
            <th className="border border-gray-400">Role</th>
            <th className="border border-gray-400">Status</th>
            <th className="border border-gray-400">Password</th>
            <th className="border border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isEditing = editingUserId === user.user_id;
            return (
              <tr className="border border-gray-400" key={user.user_id}>
                {renderTableCell(user, 'first_name', isEditing)}
                {renderTableCell(user, 'last_name', isEditing)}
                {renderTableCell(user, 'username', isEditing)}
                {renderTableCell(user, 'role', isEditing)}
                {renderTableCell(user, 'status', isEditing)}
                {renderTableCell(user, 'password', isEditing)}
                <td className="border border-gray-400">
                  {isEditing ? (
                    <>
                      <button onClick={handleFinishEdit}>Finish</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="bg-blue-500 text-white p-2 mt-4 mb-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Add New User
      </button>
      {showAddForm ? (
        <div>
          {/* Form for adding a new user */}
          <input
            className="text-center border border-black"
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleNewUserChange}
            required
          />
          <input
            className="text-center border border-black"
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleNewUserChange}
            required
          />
          <input
            className="text-center border border-black"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleNewUserChange}
            required
          />
          <input
            className="text-center border border-black"
            type="number"
            name="password"
            placeholder="Password (4 digits)"
            onChange={handleNewUserChange}
            required
          />
          <select
            name="role"
            className="m-1 border border-black"
            required
            onChange={handleNewUserChange}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="waiter">Waiter</option>
          </select>
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
          <button
            className="rounded-full m-1 p-1.5 bg-blue-500 text-white"
            onClick={handleAddNewUser}
          >
            Register
          </button>
          <button
            className="rounded-full p-1.5 bg-red-500 text-white"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-900"></div>
      )}
    </div>
  );
};

export default UserManagementTable;

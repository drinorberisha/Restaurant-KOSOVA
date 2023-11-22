import { fetchAllUsers, updateUser, addNewUser} from '@/utils/api';
import React , {useState, useEffect} from 'react';


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
    status: 'active' // Default status
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
      const updatedUsers = users.map(user => 
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
        setNewUserData(prevData => ({ ...prevData, [name]: value }));
        setPasswordError(''); // Clear error if input is valid
      } else {
        setPasswordError('Password must be 4 digits only');
      }
    } else {
      setNewUserData(prevData => ({ ...prevData, [name]: value }));
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

  return (
    <div>
      
      <button onClick={() => setShowAddForm(true)}>Add New User</button>
    {showAddForm && (
      <div>
        {/* Form for adding a new user */}
        <input type="text" name="first_name" placeholder="First Name" onChange={handleNewUserChange}required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleNewUserChange}required />
        <input type="text" name="username" placeholder="Username" onChange={handleNewUserChange} required/>
        <input type="number" name="password"  placeholder="Password (4 digits)" onChange={handleNewUserChange} required/>
        
        <select name="role" required onChange={handleNewUserChange}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="waiter">Waiter</option>

        </select>
        {passwordError && <div className="error-message">{passwordError}</div>}
        <button onClick={handleAddNewUser}>Register</button>
      </div>
    )}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user) => (
            <tr key={user.user_id}>
              {editingUserId === user.user_id ? (
                // Render input fields for editable user
                <>
                  <td><input type="text" name="first_name" value={editFormData.first_name} onChange={handleEditFormChange} /></td>
                  <td><input type="text" name="last_name" value={editFormData.last_name} onChange={handleEditFormChange} /></td>
                  <td><input type="text" name="username" value={editFormData.username} onChange={handleEditFormChange} /></td>
                  <td><input type="text" name="role" value={editFormData.role} onChange={handleEditFormChange} /></td>
                  <td><input type="text" name="status" value={editFormData.status} onChange={handleEditFormChange} /></td>
                  <td><input type="text" name="password" value={editFormData.password} onChange={handleEditFormChange} /></td>


                </>
              ) : (
                // Render text for non-editable user
                <>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.password}</td>
                  
                </>
              )}
              <td>
                {editingUserId === user.user_id ? (
                  <>
                    <button onClick={handleFinishEdit}>Finish</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                )}
              </td>
            </tr>
          ))}







         
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;

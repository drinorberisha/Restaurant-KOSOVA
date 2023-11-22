import { fetchAllUsers, updateUser } from '@/utils/api';
import React , {useState, useEffect} from 'react';


const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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
  return (
    <div>
      <h2>User Management</h2>
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

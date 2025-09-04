import { useState, useEffect, useContext } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function AdminPanel() {
  const { isAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'User' });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('Please fill all required fields');
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await createUser(newUser);
      setNewUser({ username: '', email: '', password: '', role: 'User' });
      fetchUsers();
      toast.success('User created successfully');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser.username || !editingUser.email) {
      setError('Please fill all required fields');
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      fetchUsers();
      toast.success('User updated successfully');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
        toast.success('User deleted successfully');
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setError('');
  };

  const handleChange = (e, isNew = false) => {
    const target = isNew ? newUser : editingUser;
    const setter = isNew ? setNewUser : setEditingUser;
    setter({ ...target, [e.target.name]: e.target.value });
  };

  if (!isAdmin) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500 text-lg font-medium">
          Access denied. Admin only.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h2>
      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg mb-6">
          {error}
        </p>
      )}
      {/* Create User Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">Create New User</h3>
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={(e) => handleChange(e, true)}
              className="input-field"
              required
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={(e) => handleChange(e, true)}
              className="input-field"
              required
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={(e) => handleChange(e, true)}
              className="input-field"
              required
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={(e) => handleChange(e, true)}
              className="input-field"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Create User
          </button>
        </form>
      </div>
      {/* User List */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">User List</h3>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Username</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="btn-secondary bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn-secondary bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Edit User</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={(e) => handleChange(e)}
                  className="input-field"
                  required
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) => handleChange(e)}
                  className="input-field"
                  required
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => handleChange(e)}
                  className="input-field"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-secondary bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
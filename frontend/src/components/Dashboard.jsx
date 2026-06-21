import { useEffect, useState, useCallback } from 'react';
import api from '../api';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (path) => {
    await api.post(`/users/${path}`, { userIds: selectedIds });
    setSelectedIds([]);
    fetchUsers();
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-md-5">
      <div className="bg-white rounded shadow-sm overflow-hidden border">
        
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => handleAction('block')}>
              <i className="bi bi-lock-fill"></i> Block
            </button>
            <button className="btn btn-outline-danger p-2" onClick={() => handleAction('delete')}>
              <i className="bi bi-trash"></i>
            </button>
            <button className="btn btn-outline-secondary p-2" onClick={() => handleAction('unblock')}>
              <i className="bi bi-unlock"></i>
            </button>
            <button className="btn btn-outline-danger p-2" onClick={() => handleAction('delete-unverified')}>
               <i className="bi bi-person-x"></i>
            </button>
          </div>
          <div className="col-md-3">
             <input type="text" className="form-control form-control-sm" placeholder="Filter" />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light text-muted small">
              <tr>
                <th className="px-4"><input type="checkbox" className="form-check-input" /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {users.map(user => (
                <tr key={user.id} className="align-middle">
                  <td className="px-4">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      checked={selectedIds.includes(user.id)}
                      onChange={(e) => {
                         if(e.target.checked) setSelectedIds([...selectedIds, user.id]);
                         else setSelectedIds(selectedIds.filter(id => id !== user.id));
                      }}
                    />
                  </td>
                  <td className="py-3">
                    <div className="fw-bold">{user.name}</div>
                    <div className="text-muted small">N/A</div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="small text-muted">{new Date(user.last_login_time).toLocaleString()}</div>
                    <div className="mt-1" style={{ width: '60px', height: '10px', background: '#e2e8f0', borderRadius: '2px' }}>
                      <div style={{ width: '40%', height: '100%', background: '#0d6efd', borderRadius: '2px' }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


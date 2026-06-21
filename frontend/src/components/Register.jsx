import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        
        <div className="col-lg-5 d-flex flex-column p-5 justify-content-center bg-white">
          
          <div style={{ maxWidth: '400px' }} className="mx-auto w-100">
            <p className="text-muted mb-1">Start your journey</p>
            <h3 className="fw-bold mb-4">Create your account</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="text-muted small mb-1">Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person text-primary"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    placeholder="John Doe"
                    required
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted small mb-1">E-mail</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-envelope text-primary"></i>
                  </span>
                  <input 
                    type="email" 
                    className="form-control border-start-0" 
                    placeholder="test@example.com"
                    required
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock text-primary"></i>
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control border-start-0 border-end-0" 
                    placeholder="********"
                    required
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <span 
                    className="input-group-text bg-white" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-4">
                Register
              </button>
            </form>

            <div className="text-center small">
              Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-7 d-none d-lg-block">
          <div 
            className="h-100" 
            style={{ 
              backgroundImage: `url('https://wallpaperswide.com/download/3d_geometric_shapes_windows_11-wallpaper-2560x1440.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>

      </div>
    </div>
  );
}

export default Register;
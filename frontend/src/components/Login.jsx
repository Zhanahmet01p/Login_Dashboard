import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-lg-5 d-flex flex-column p-5 justify-content-center bg-white">
          
          <div style={{ maxWidth: '400px' }} className="mx-auto w-100">
            <p className="text-muted mb-1">Start your journey</p>
            <h3 className="fw-bold mb-4">Sign In to The App</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="text-muted small mb-1">E-mail</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><i className="bi bi-envelope text-primary"></i></span>
                  <input 
                    type="email" 
                    className="form-control border-start-0" 
                    placeholder="test@example.com"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><i className="bi bi-lock text-primary"></i></span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    placeholder="********"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <span className="input-group-text bg-white"><i className="bi bi-eye"></i></span>
                </div>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label small" htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot" className="small text-decoration-none">Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-4">Sign In</button>
            </form>

            <div className="text-center small">
              Don't have an account? <Link to="/register" className="text-decoration-none">Sign Up</Link>
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

export default Login;





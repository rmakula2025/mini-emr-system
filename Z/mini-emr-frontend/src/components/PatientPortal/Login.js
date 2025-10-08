import { useState } from "react";
import { patientAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await patientAPI.post("login/", { email, password });
      console.log("Login response:", res.data);
      setUser(res.data);
      navigate("/portal/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Patient Portal Login</h2>
        {error && <div className="alert alert-warning">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            Login
          </button>
        </form>
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <a href="/admin" style={{color: '#007bff'}}>Admin Portal</a>
        </div>
      </div>
    </div>
  );
}

export default Login;

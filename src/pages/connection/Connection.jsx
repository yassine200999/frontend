import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { signin, createUser } from "../../services/authService.jsx";
import { getErrorMessage } from "../../services/errors.jsx";

const emptySignup = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
};

function Connection() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState(emptySignup);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLogin((current) => ({ ...current, [name]: value }));
  }

  function handleSignupChange(event) {
    const { name, value } = event.target;
    setSignup((current) => ({ ...current, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await signin(login);
      setUser(data.CurrentUser);
      navigate("/");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (signup.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      await createUser(signup);
      setSignup(emptySignup);
      setSuccess("Compte créé. Vous pouvez maintenant vous connecter.");
      setLogin({ email: signup.email, password: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-grid auth-grid">
      {error && <p className="error-box" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}

      <form className="form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="vous@exemple.com"
            value={login.email}
            onChange={handleLoginChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={login.password}
            onChange={handleLoginChange}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Veuillez patienter..." : "Se connecter"}
        </button>
      </form>

      <form className="form" onSubmit={handleSignup}>
        <h2>Créer un compte</h2>
        <div className="form-group">
          <label htmlFor="first_name">Prénom</label>
          <input id="first_name" name="first_name" autoComplete="given-name" required value={signup.first_name} onChange={handleSignupChange} />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Nom</label>
          <input id="last_name" name="last_name" autoComplete="family-name" required value={signup.last_name} onChange={handleSignupChange} />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" name="email" autoComplete="email" required value={signup.email} onChange={handleSignupChange} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input id="phone" type="tel" name="phone" autoComplete="tel" required value={signup.phone} onChange={handleSignupChange} />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Mot de passe (8 caractères minimum)</label>
          <input id="signup-password" type="password" name="password" autoComplete="new-password" minLength={8} required value={signup.password} onChange={handleSignupChange} />
        </div>
        <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
          {loading ? "Veuillez patienter..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}

export default Connection;

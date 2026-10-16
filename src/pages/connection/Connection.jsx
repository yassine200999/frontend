import { useState } from "react";

function Connexion() {
  const [login, setLogin] = useState({ email: "", password: "" });

  const [signup, setSignup] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  function handleLoginChange(event) {}

  function handleLogin(event) {}

  function handleSignupChange(event) {}

  function handleSignup(event) {}

  return (
    <div className="profile-grid auth-grid">
      {/* ---------- Se connecter ---------- */}
      <form className="form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
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
            value={login.password}
            onChange={handleLoginChange}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Se connecter
        </button>
      </form>

      {/* ---------- Créer un compte ---------- */}
      <form className="form" onSubmit={handleSignup}>
        <h2>Créer un compte</h2>

        <div className="form-group">
          <label htmlFor="first_name">Prénom</label>
          <input
            id="first_name"
            name="first_name"
            value={signup.first_name}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Nom</label>
          <input
            id="last_name"
            name="last_name"
            value={signup.last_name}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={signup.email}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            name="phone"
            value={signup.phone}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Mot de passe</label>
          <input
            id="signup-password"
            type="password"
            name="password"
            value={signup.password}
            onChange={handleSignupChange}
          />
        </div>

        <button type="submit" className="btn btn-dark btn-block">
          Créer mon compte
        </button>
      </form>
    </div>
  );
}
export default Connexion;
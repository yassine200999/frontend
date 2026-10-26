import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { signin, createUser } from "../../services/authService.jsx";
import { getErrorMessage } from "../../services/errors.jsx";
const emptySignup = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
};

function Connexion() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [signup, setSignup] = useState(emptySignup);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

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
    setLoginError("");
    setSignupSuccess("");

    if (!login.email || !login.password) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    setLoginLoading(true);

    try {
      const data = await signin(login);

      if (!data?.token || !data?.CurrentUser) {
        throw new Error("Réponse de connexion invalide du serveur.");
      }

      setUser(data.CurrentUser);
      navigate("/profil");
    } catch (error) {
      setLoginError(getErrorMessage(error));
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (
      !signup.first_name.trim() ||
      !signup.last_name.trim() ||
      !signup.email.trim() ||
      !signup.phone_number.trim() ||
      !signup.password
    ) {
      setSignupError("Veuillez remplir tous les champs.");
      return;
    }

    if (signup.password.length < 8) {
      setSignupError(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    setSignupLoading(true);

    try {
      await createUser(signup);

      setSignupSuccess(
        "Votre compte a été créé avec succès ! Vous pouvez vous connecter."
      );

      setLogin({
        email: signup.email,
        password: "",
      });

      setSignup(emptySignup);
    } catch (error) {
      setSignupError(getErrorMessage(error));
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <div className="profile-grid auth-grid">
      <form className="form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>

        {loginError && (
          <p className="error-box" role="alert">
            {loginError}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            required
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

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loginLoading}
        >
          {loginLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <form className="form" onSubmit={handleSignup}>
        <h2>Créer un compte</h2>

        {signupError && (
          <p className="error-box" role="alert">
            {signupError}
          </p>
        )}

        {signupSuccess && (
          <p className="success" role="status">
            {signupSuccess}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="first_name">Prénom</label>
          <input
            id="first_name"
            name="first_name"
            autoComplete="given-name"
            required
            value={signup.first_name}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Nom</label>
          <input
            id="last_name"
            name="last_name"
            autoComplete="family-name"
            required
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
            autoComplete="email"
            required
            value={signup.email}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            type="tel"
            name="phone_number"
            autoComplete="tel"
            required
            value={signup.phone_number}
            onChange={handleSignupChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">
            Mot de passe (8 caractères minimum)
          </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={signup.password}
            onChange={handleSignupChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark btn-block"
          disabled={signupLoading}
        >
          {signupLoading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}

export default Connexion;

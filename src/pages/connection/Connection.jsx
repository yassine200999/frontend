import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { signin, createUser } from "../../servis/auth.jsx";
import { getErrorMessage } from "../../services/errors.jsx";
import { useNavigate } from "react-router-dom";

function connection() {
  const navigate = useNavigate();
  // useAuth : récupère depuis le Context la fonction qui enregistre la session
  // (token + utilisateur) dans le state ET dans localStorage
  const { saveSession } = useAuth();

  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [signup, setSignup] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(""); // message de succès

  function handleLoginChange(event) {
    setLogin({ ...login, [event.target.name]: event.target.value });
  }

  async function handleLogin(event) {
    event.preventDefault(); // empeche le chargemenet automatique de la page
    setLoginError(""); // réinitialise le message d'erreur

    if (!login.email || !login.password) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    setLoginLoading(true); // Indique que la requête est en cours
    try {
      const data = await signin(login.email, login.password);

      saveSession(data.token, data.CurrentUser); // Enregistre le token et l'utilisateur dans le contexte et localStorage
      navigate("/profil"); // Redirige vers la page d'accueil après la connection
    } catch (error) {
      setLoginError(getErrorMessage(error, "Email ou mot de passe incorrect."));
    } finally {
      setLoginLoading(false); // Réinitialise l'état de chargement
    }
  }

  function handleSignupChange(event) {
    setSignup({ ...signup, [event.target.name]: event.target.value });
  }

  async function handleSignup(event) {
    event.preventDefault(); // empeche le chargemenet automatique de la page
    setSignupError(""); // réinitialise le message d'erreur
    if (
      !signup.first_name ||
      !signup.last_name ||
      !signup.email ||
      !signup.phone_number ||
      !signup.password
    ) {
      setSignupError("Veuillez remplir tous les champs.");
      return;
    }
    setSignupLoading(true); // Indique que la requête est en cours
    try {
      await createUser(signup);
      setSignupSuccess("Votre compte a été créé avec succès !");

      setLogin({ email: signup.email, password: "" }); // Pré-remplit le formulaire de connection

      setSignup({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
      });
    } catch (error) {
      setSignupError(getErrorMessage(error, "Inscription impossible."));
    } finally {
      setSignupLoading(false); // Réinitialise l'état de chargement
    }
  }

  return (
    <div className="profile-grid auth-grid">
      {/* ---------- Se connecter ---------- */}
      <form className="form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>

        <div className="form-group">
          <label htmlFor="login-email">Email</label>
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
        {loginError && <p className="error-box">{loginError}</p>}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loginLoading}
        >
          {loginLoading ? "connection..." : "Se connecter"}
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
            name="phone_number"
            value={signup.phone_number}
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

        {signupError && <p className="error-box">{signupError}</p>}
        {signupSuccess && <p className="success">{signupSuccess}</p>}

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
export default connection;

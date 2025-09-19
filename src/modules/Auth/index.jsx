// modules/Auth.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

class Auth {
  constructor() {
    this.user_token = this.loadUserToken();
    if (auth) {
      this.init();
    } else {
    }
  }

  loadUserToken() {
    const stored = localStorage.getItem("auth");
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      // Handle string token from LoginForm
      if (typeof parsed === "string") {
        return { token: parsed };
      }
      return parsed;
    } catch (error) {
      return {};
    }
  }

  init() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          const newToken = {
            token,
            user_id: user.uid,
            user_name: user.displayName || user.email,
            email: user.email,
          };
          this.setUserToken(newToken);
        }).catch((error) => {
        });
      } else {
        // Only clear if no backend token exists
        const currentToken = this.getToken();
        if (!currentToken) {
          this.logout();
        }
      }
    });
  }

  getToken() {
    return this.user_token.token || null;
  }

  getUserId() {
    return this.user_token.user_id || null;
  }

  getUserDetails() {
    return this.user_token && Object.keys(this.user_token).length ? this.user_token : null;
  }

  setUserToken(new_token) {
    this.user_token = new_token;
    localStorage.setItem("auth", JSON.stringify(new_token));
  }

  logout() {
    if (auth) {
      signOut(auth).catch((error) => {return "Auth: Sign out error:", error});
    }
    this.user_token = {};
    localStorage.removeItem("auth");
  }
}

export default new Auth();
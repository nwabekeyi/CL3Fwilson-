// modules/Auth.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

class Auth {
  constructor() {
    this.user_token = this.loadUserToken();
    if (auth) {
      this.init();
    } else {
      console.warn("Firebase auth not initialized. Ensure firebase/config.js is imported.");
    }
  }

  loadUserToken() {
    const stored = localStorage.getItem("auth");
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      // Handle string token from LoginForm
      if (typeof parsed === "string") {
        console.warn("Auth: Converting string token to object");
        return { token: parsed };
      }
      return parsed;
    } catch (error) {
      console.error("Auth: Error parsing auth token:", error);
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
          console.log("Auth: User signed in:", { email: user.email, user_id: user.uid });
        }).catch((error) => {
          console.error("Auth: Error getting token:", error);
        });
      } else {
        // Only clear if no backend token exists
        const currentToken = this.getToken();
        if (!currentToken) {
          this.logout();
          console.log("Auth: No user signed in");
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
      signOut(auth).catch((error) => console.error("Auth: Sign out error:", error));
    }
    this.user_token = {};
    localStorage.removeItem("auth");
    console.log("Auth: Logged out");
  }
}

export default new Auth();
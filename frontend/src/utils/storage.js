const ACCESS_TOKEN_KEY = "secure_auth_access_token";
const PENDING_2FA_KEY = "secure_auth_pending_2fa";

export const tokenStorage = {
  get() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export const pendingTwoFactorStorage = {
  get() {
    const value = sessionStorage.getItem(PENDING_2FA_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      sessionStorage.removeItem(PENDING_2FA_KEY);
      return null;
    }
  },
  set(payload) {
    sessionStorage.setItem(PENDING_2FA_KEY, JSON.stringify(payload));
  },
  clear() {
    sessionStorage.removeItem(PENDING_2FA_KEY);
  },
};

import api from "./api";

export const authService = {
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  async verifyTwoFactor(payload) {
    const { data } = await api.post("/auth/verify-2fa", payload);
    return data;
  },
  async getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

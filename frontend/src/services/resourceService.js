import api from "./api";

export const resourceService = {
  async getProfile() {
    const { data } = await api.get("/profile");
    return data;
  },
  async getAdmin() {
    const { data } = await api.get("/admin");
    return data;
  },
  async getManager() {
    const { data } = await api.get("/manager");
    return data;
  },
};

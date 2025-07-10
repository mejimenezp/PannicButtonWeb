import api from "./api";

export const sendMassSMS = async ({ to, message }) => {
  const res = await api.post("/send-mass", { to, message });
  return res.data;
};

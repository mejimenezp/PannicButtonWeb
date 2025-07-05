import api from "./api";

export const sendMassEmail = async ({ to, subject, message }) => {
  const res = await api.post("/emails/mass", { to, subject, message });
  return res.data;
};
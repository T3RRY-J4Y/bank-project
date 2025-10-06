import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;
const PEPPER = process.env.PEPPER || "supersecretpepper";

export const hashPassword = async (password) => {
  const salted = password + PEPPER;
  return await bcrypt.hash(salted, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  const salted = password + PEPPER;
  return await bcrypt.compare(salted, hash);
};

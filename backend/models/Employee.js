import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

export default mongoose.model("Employee", employeeSchema);

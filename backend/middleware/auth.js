import jwt from "jsonwebtoken";
import { 
  nameRegex, 
  idNumberRegex, 
  accountRegex, 
  passwordRegex 
} from "../utils/validators.js";

export const authCustomer = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const authEmployee = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ message: "No admin token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid admin token" });
  }
};

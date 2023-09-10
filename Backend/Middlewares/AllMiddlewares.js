import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

export const checkSeller = async (req, res, next) => {
  try {
    //   console.log(req.body, "req.body here");
    const { token } = req.body;
    //   console.log(token, "token here");

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid token!" });

    const userId = decodedData.userId;
    const user = await UserModel.findById(userId);

    if (!user || user.role != "Seller")
      return res
        .status(404)
        .json({ success: false, message: "Not a valid user!" });

    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

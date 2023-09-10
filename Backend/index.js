import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import {
  Login,
  Register,
  getCurrentUser,
} from "./Controllers/UserController.js";
import { addProduct, allProducts } from "./Controllers/ProductController.js";
import { checkSeller } from "./Middlewares/AllMiddlewares.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.use(morgan("dev"));

// user
app.post("/register", Register);
app.post("/login", Login);
app.post("/get-current-user", getCurrentUser);

app.post("/add-product", checkSeller, addProduct);
app.post("/all-products", allProducts);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.log("Something went wrong", error);
  });

app.listen(8000, () => {
  console.log("listening on port 8000..");
});

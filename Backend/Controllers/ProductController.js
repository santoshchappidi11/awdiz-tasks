import jwt from "jsonwebtoken";
import ProductModel from "../Models/ProductModel.js";

export const addProduct = async (req, res) => {
  try {
    const { image, name, price, category } = req.body.addProductData;
    const { token } = req.body;

    console.log(image, name, price, category, token);

    if (!image || !name || !price || !category || !token)
      return res
        .status(404)
        .json({ success: false, message: "All fields are mandatory!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const product = new ProductModel({
      image,
      name,
      price,
      category,
      userId: userId,
    });
    await product.save();

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const allProducts = async (req, res) => {
  try {
    const { page, limit = 2, name, sort = "date" } = req.body;
    const { filter } = req.body.filterByDate;
    console.log(name);

    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // const sortPrefix = sort[0] == "-" ? "-" : "";
    const sortField = sort.replace(/^-/, "");
    const sortOption = { [sortField]: `${filter}` };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const products = await ProductModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitValue)
      .lean();

    // const products = await ProductModel.find({});

    if (products?.length) {
      return res.status(200).json({ success: true, products: products });
    }
    return res.status(404).json({ success: false, message: "No Products!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

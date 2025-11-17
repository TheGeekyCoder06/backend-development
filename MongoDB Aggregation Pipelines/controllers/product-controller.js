import Product from "../models/ProductModel.js";

const addProduct = async (req, res) => {
  try {
    const data = await fetch("https://dummyjson.com/products").then((res) =>
      res.json()
    );

    const formattedProducts = data.products.map((p) => ({
      name: p.title,
      category: p.category,
      price: p.price,
      inStock: p.stock > 0,
      tags: p.tags || [],
    }));

    await Product.insertMany(formattedProducts);

    res.status(200).json({ inserted: formattedProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductStats = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          inStock: true,
          price: { $gte: 100 },
        },
      },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductAnalysis = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          category: "furniture",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          avgPrice: { $avg: "$price" },
          totalProducts: { $sum: 1 },
          maxProductPrice: { $max: "$price" },
          minProductPrice: { $min: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          avgPrice: 1,
          totalProducts: 1,
          maxProductPrice: 1,
          minProductPrice: 1,
          priceRange: { $subtract: ["$maxProductPrice", "$minProductPrice"] },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { addProduct, getProductStats, getProductAnalysis };

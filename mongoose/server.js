import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

console.log("MONGO URI IS ", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((e) => console.log(e));

const productSchema = new mongoose.Schema(
  {
    productName: String,
    price: Number,
    color: String,
  },
  { timestamps: true }
);

// product model
const Product = mongoose.model("Product", productSchema);

async function runQueries() {
  try {
    //create a new model
    const newProduct = await Product.create({
      productName: "Pen",
      price: 10,
      color: "Green",
    });

    console.log("Created new Product ", newProduct);

    // fetch all products
    const products = await Product.find({});
    console.log("All Products ", products);

    // fetch products with price less than 50
    const cheapProducts = await Product.find({ price: { $lt: 50 } });
    console.log("Cheap Products ", cheapProducts);

    // update a product
    const updatedProduct = await Product.findByIdAndUpdate(
      newProduct._id,
      { price: 15 },
      { new: true }
    );
    console.log("Updated Product ", updatedProduct);

    // delete a product
    const deletedProduct = await Product.findByIdAndDelete(newProduct._id);
    console.log("Deleted Product ", deletedProduct);

  } catch (e) {
    console.log("error", e);
  } finally {
    await mongoose.connection.close();
  }
}

runQueries();

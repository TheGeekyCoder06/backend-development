import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    tags: [String],
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
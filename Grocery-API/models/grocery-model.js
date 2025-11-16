import mongoose from "mongoose";

const GrocerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true
})

const Grocery = mongoose.model("Grocery", GrocerySchema);

export default Grocery;
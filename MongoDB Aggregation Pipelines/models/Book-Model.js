import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    author : { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    genres: [String],
}, { timestamps: true });

const Book = mongoose.model("Book", BookSchema);

export default Book;
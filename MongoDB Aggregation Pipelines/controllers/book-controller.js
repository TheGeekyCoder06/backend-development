import Author from "../models/Author-Model.js";
import Book from "../models/Book-Model.js";

const createAuthor = async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({
        message: "Author created successfully",
        success: true,
        data: author,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
        message: "Book created successfully",
        success: true,
        data: book,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBookWithAuthor = async (req, res) => {
    try{
        const books = await Book.findById(req.params.id).populate("author"); // Populate author details
        if(!books){
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({
            message: "Book fetched successfully",
            success: true,
            data: books,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Server Error" });   
    }
};

export { createAuthor, createBook, getBookWithAuthor };
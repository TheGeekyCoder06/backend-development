import express from "express";

import {
  createAuthor,
  createBook,
  getBookWithAuthor,
} from "../controllers/book-controller.js";

const router = express.Router();

router.post("/authors", createAuthor);
router.post("/books", createBook);
router.get("/books/:id", getBookWithAuthor);

export default router;

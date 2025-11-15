import express from "express";
const app = express();

// Middleware

app.use(express.json());

let books = [
  {
    id: "1",
    title: "Book 1",
  },
  {
    id: "2",
    title: "Book 2",
  },
  {
    id: "3",
    title: "Book 3",
  },
];

// get all books
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to our bookstore api",
  });
});

app.get("/get-books", (req, res) => {
  res.json(books);
});

// get a single book
app.get("/get-book/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.post("/add", (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: `Book ${books.length + 1}`,
  };
  books.push(newBook);
  res.status(200).json({
    data: newBook,
    message: "New Book is added successfully",
  });
});

// update a book
app.put("/update/:id", (req, res) => {
  const findCurrentBook = books.find(
    (bookItem) => bookItem.id === req.params.id
  );
  if (findCurrentBook) {
    findCurrentBook.title = req.body.title || findCurrentBook.title;

    res.status(200).json({
      message: `Book with ID ${req.params.id} updated successfully`,
      data: findCurrentBook,
    });
  } else {
    res.status(404).json({
      message: "Book not found",
    });
  }
});

app.delete('/delete/:id', (req, res) => {
  const bookIndex = books.findIndex(bookItem => bookItem.id === req.params.id);
  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1);
    res.status(200).json({
      message: `Book with ID ${req.params.id} deleted successfully`,
      data: deletedBook[0],
    });
  } else {
    res.status(404).json({
      message: "Book not found",
    });
  }
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost/${3000}`);
});

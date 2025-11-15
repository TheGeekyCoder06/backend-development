import express from 'express';
const app = express();

const myMiddleware = (req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
};

const requestTimeStampLogger = (req, res, next) => {
  const timeStamp = new Date().toISOString();
  console.log(`Request received at: ${timeStamp}`);
  next();
};

// Apply BOTH middlewares before routes
app.use(myMiddleware);
app.use(requestTimeStampLogger);

app.get('/', (req, res) => {
  res.send('Hello from middleware!');
});

app.get('/about', (req, res) => {
  res.send('Hello from middleware!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


// app.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------- Config / App ----------
const app = express();
const PORT = process.env.PORT || 3000;

// EJS view engine (optional)
app.set('view engine', 'ejs');

// --------- Middlewares ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// CORS (allow origin from env or all)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10), // e.g., 1 minute
  max: parseInt(process.env.RATE_MAX || '100', 10), // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// --------- Mongoose / Models ----------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/express_all_in_one';
mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

// --------- JWT helpers ----------
const signJwt = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

const verifyJwt = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret', (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });

// JWT middleware
const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.cookies.token;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    // support "Bearer <token>" or token in cookie
    const token = authHeader.startsWith?.('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    const decoded = await verifyJwt(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --------- Basic Auth middleware ----------
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm"');
    return res.status(401).send('Authorization required');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [user, pass] = credentials.split(':');

  const envUser = process.env.BASIC_USER || 'admin';
  const envPass = process.env.BASIC_PASS || 'adminpassword';

  if (user === envUser && pass === envPass) {
    req.basicUser = user;
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm"');
  return res.status(401).send('Invalid credentials');
};

// --------- Multer (file uploads) ----------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, `${unique}-${sanitized}`);
  },
});

const fileFilter = (req, file, cb) => {
  // accept only images for demo; adjust as needed
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

// --------- Routes ----------

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Home
app.get('/', (req, res) => {
  res.send('Hello World from single-file Express app!');
});

// --- Registration ---
app.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, email, password: hashed });
    await user.save();

    return res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Username or email already exists' });
    next(err);
  }
});

// --- Login (JWT) ---
app.post('/login', async (req, res, next) => {
  try {
    const { username, password, remember } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJwt({ id: user._id, username: user.username, role: user.role });
    // Set token as cookie for convenience
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60, // 7d or 1h
    });

    return res.json({ message: 'Authenticated', token });
  } catch (err) {
    next(err);
  }
});

// --- Protected profile (JWT) ---
app.get('/profile', jwtAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

// --- File upload (JWT protected) ---
app.post('/upload', jwtAuth, upload.single('file'), (req, res) => {
  // make sure to send form-data with key `file`
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    message: 'File uploaded',
    file: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
    },
  });
});

// expose uploads (static) securely (in production, serve from CDN or with auth)
app.use('/uploads', express.static(uploadDir));

// --- Session-based auth (simple) ---
app.post('/session-login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // set session
    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ message: 'Session created', session: { id: req.sessionID } });
  } catch (err) {
    next(err);
  }
});

const sessionAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: 'Not authenticated (session)' });
};

app.get('/session-profile', sessionAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

app.post('/logout', (req, res, next) => {
  req.session?.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.json({ message: 'Logged out' });
  });
});

// --- Basic auth protected route ---
app.get('/basic-protected', basicAuth, (req, res) => {
  res.json({ message: `Hello ${req.basicUser}, you passed Basic auth` });
});

// --- Basic protected with local "basic" middleware (alternative)
app.get('/whoami', jwtAuth, (req, res) => {
  res.json({ you: req.user });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('Error handler:', err?.stack || err);
  const status = err?.status || 500;
  res.status(status).json({ error: err?.message || 'Internal Server Error' });
});

// --------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

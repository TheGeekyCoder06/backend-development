#!/bin/bash

# Init npm project
npm init -y

# Modify package.json: add type: module & dev script
if command -v jq >/dev/null 2>&1; then
    tmpfile=$(mktemp)
    jq '.type="module" | .scripts.dev="nodemon server.js"' package.json > "$tmpfile" && mv "$tmpfile" package.json
else
    sed -i '' 's/"scripts": {/"type": "module",\n  "scripts": {\n    "dev": "nodemon server.js",/' package.json
fi

# Install dependencies
npm install express mongoose dotenv
npm install --save-dev nodemon

# Create folder structure
mkdir -p controllers
mkdir -p db
mkdir -p models
mkdir -p routes
mkdir -p middleware
mkdir -p utils

# Create empty files
touch controllers/controller.js
touch models/model.js
touch routes/routes.js
touch middleware/middleware.js
touch utils/utils.js
touch .gitignore
touch .env.local

# ---- .gitignore template ----
cat <<EOF > .gitignore
node_modules/

# Logs
logs
*.log

# Environment files
.env
.env.local
.env.*.local

# Output
dist/
build/

# OS / Editors
.DS_Store
.vscode/
.idea/
EOF

# ---- .env.local template ----
cat <<EOF > .env.local
PORT=3000
MONGO_URI=
EOF

# ---- dbConfig.js template ----
cat <<EOF > db/dbConfig.js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
EOF

# ---- server.js template ----
cat <<EOF > server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Database connection
connectDB();

// Built-in middleware
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
EOF

echo "Backend template setup complete (with utils folder)!"

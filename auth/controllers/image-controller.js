import Image from "../models/image.js";
import { uploadImage as uploadImageHelper } from "../helpers/cloudinary.js";
import fs from "fs";
const uploadImage = async (req, res) => {
  try {
    // 1) validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 2) upload to Cloudinary using your helper
    const uploaded = await uploadImageHelper(req.file.path);
    // uploaded = { url, public_id }

    // 3) save record to DB (matches your Image model)
    const newImage = await Image.create({
      url: uploaded.url,
      publicId: uploaded.public_id,
      altText: req.body.altText || "",
      uploadedBy: req.user.userId, // as per your JWT payload
    });
    // delete the file from local uploads folder after uploading to cloudinary
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("uploadImage error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Image.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("getAllImages error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { uploadImage, getAllImages };

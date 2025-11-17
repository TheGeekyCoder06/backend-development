import Image from "../models/image.js";
import { uploadImage as uploadImageHelper } from "../helpers/cloudinary.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary-image.js";
import { parse } from "path";
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
    const page = parseInt(req.query.page) || 1; // current page number
    const limit = parseInt(req.query.limit) || 2; // number of images per page
    const skip = (page - 1) * limit; // number of images to skip

    const sortBy = req.query.sortBy || "createdAt"; // field to sort by
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // sort order

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalImages,
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

const deleteImageController = async (req, res) => {
  try {
    // delete both from mongodb and cloudinary

    // 1. find image by id and verify if the logged in user is the owner ie uploadedBy by userId from JWT
    const getCurrentId = req.params.id;
    const userId = req.user.userId;

    const image = await Image.findById(getCurrentId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // check if the logged in user is the owner of the image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }

    // 2. delete from cloudinary
    const publicId = image.publicId;
    await cloudinary.uploader.destroy(publicId); // deletes from cloudinary

    // 3. delete from mongodb
    await Image.findByIdAndDelete(getCurrentId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("deleteImageController error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { uploadImage, getAllImages, deleteImageController };

import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const fileBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder: "luxecart-products",
          }
        );

      res.json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.log("Upload Error:", error);

      res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

export default router;
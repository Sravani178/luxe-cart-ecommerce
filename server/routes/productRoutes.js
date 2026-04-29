import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  createReview,
} from "../controllers/productController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// GET all products + CREATE product
router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    authorize("seller", "admin"),
    createProduct
  );


// IMPORTANT → must be ABOVE /:slug
router.get(
  "/my-products",
  protect,
  authorize("seller", "admin"),
  getMyProducts
);


// Single product by slug
router
  .route("/:slug")
  .get(getProductBySlug);


// Update + Delete product
router
  .route("/id/:id")
  .put(
    protect,
    authorize("seller", "admin"),
    updateProduct
  )
  .delete(
    protect,
    authorize("seller", "admin"),
    deleteProduct
  );


// Product review
router.post(
  "/:id/reviews",
  protect,
  createReview
);

export default router;
import Product from "../models/Product.js";


// @desc    Get all products with filtering, search, pagination
// @route   GET /api/products
export const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const queryObj = {
    isActive: true,
  };

  // Search
  if (req.query.search) {
    queryObj.$text = {
      $search: req.query.search,
    };
  }

  // Category filter
  if (
    req.query.category &&
    req.query.category !== "all"
  ) {
    queryObj.category = req.query.category;
  }

  // Price filter
  if (
    req.query.minPrice ||
    req.query.maxPrice
  ) {
    queryObj.price = {};

    if (req.query.minPrice) {
      queryObj.price.$gte = Number(
        req.query.minPrice
      );
    }

    if (req.query.maxPrice) {
      queryObj.price.$lte = Number(
        req.query.maxPrice
      );
    }
  }

  // Featured filter
  if (req.query.featured === "true") {
    queryObj.featured = true;
  }

  // Sorting
  let sortObj = {
    createdAt: -1,
  };

  if (req.query.sort) {
    switch (req.query.sort) {
      case "price-asc":
        sortObj = { price: 1 };
        break;

      case "price-desc":
        sortObj = { price: -1 };
        break;

      case "rating":
        sortObj = { rating: -1 };
        break;

      case "newest":
        sortObj = { createdAt: -1 };
        break;

      default:
        sortObj = { createdAt: -1 };
    }
  }

  const count =
    await Product.countDocuments(queryObj);

  const products = await Product.find(
    queryObj
  )
    .populate("seller", "name")
    .sort(sortObj)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .select("-reviews");

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};


// @desc    Get single product by slug
// @route   GET /api/products/:slug
export const getProductBySlug = async (
  req,
  res
) => {
  const product =
    await Product.findOne({
      slug: req.params.slug,
    })
      .populate("seller", "name")
      .populate(
        "reviews.user",
        "name avatar"
      );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    product,
  });
};


// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (
  req,
  res
) => {
  const productData = {
    ...req.body,
    seller: req.user._id,
  };

  const product =
    await Product.create(productData);

  res.status(201).json({
    success: true,
    product,
  });
};


// @desc    Update product
// @route   PUT /api/products/id/:id
export const updateProduct = async (
  req,
  res
) => {
  let product =
    await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (
    product.seller.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to update this product"
    );
  }

  product =
    await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

  res.json({
    success: true,
    product,
  });
};


// @desc    Delete product
// @route   DELETE /api/products/id/:id
export const deleteProduct = async (
  req,
  res
) => {
  const product =
    await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (
    product.seller.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to delete this product"
    );
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product removed",
  });
};


// @desc    Get seller's own products
// @route   GET /api/products/my-products
export const getMyProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find({
        seller: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .populate("seller", "name");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch seller products",
    });
  }
};


// @desc    Create product review
// @route   POST /api/products/:id/reviews
export const createReview = async (
  req,
  res
) => {
  const { rating, comment } = req.body;

  const product =
    await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed =
    product.reviews.find(
      (review) =>
        review.user.toString() ===
        req.user._id.toString()
    );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error(
      "Product already reviewed"
    );
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);

  product.numReviews =
    product.reviews.length;

  product.rating =
    product.reviews.reduce(
      (acc, item) =>
        acc + item.rating,
      0
    ) / product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added",
  });
};
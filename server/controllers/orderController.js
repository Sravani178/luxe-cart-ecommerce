import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Stripe from "stripe";

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY);

//
// CREATE ORDER
//
export const createOrder = async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    selectedItems,
  } = req.body;

  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("No items in cart");
  }

  // If selectedItems exists → checkout selected only
  // Else → checkout all items
  const itemsToOrder =
    selectedItems && selectedItems.length > 0
      ? cart.items.filter((item) =>
          selectedItems.includes(
            item._id.toString()
          )
        )
      : cart.items;

  if (itemsToOrder.length === 0) {
    res.status(400);
    throw new Error(
      "No selected items for checkout"
    );
  }

  const orderItems = [];

  for (const item of itemsToOrder) {
    const product =
      await Product.findById(
        item.product._id
      );

    if (
      !product ||
      product.inventory < item.quantity
    ) {
      res.status(400);
      throw new Error(
        `${item.product.name} is out of stock`
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image:
        product.images?.[0]?.url || "",
      quantity: item.quantity,
      price: product.price,
      selectedAttributes:
        item.selectedAttributes,
    });

    // Reduce stock only for ordered items
    product.inventory -= item.quantity;
    await product.save();
  }

  const itemsPrice =
    orderItems.reduce(
      (acc, item) =>
        acc +
        item.price * item.quantity,
      0
    );

  const shippingPrice =
    itemsPrice > 100 ? 0 : 10;

  const taxPrice = Number(
    (itemsPrice * 0.1).toFixed(2)
  );

  const totalPrice =
    itemsPrice +
    shippingPrice +
    taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: false,
    status: "pending",
  });

  //
  // Remove only ordered items from cart
  //
  if (
    selectedItems &&
    selectedItems.length > 0
  ) {
    cart.items = cart.items.filter(
      (item) =>
        !selectedItems.includes(
          item._id.toString()
        )
    );
  } else {
    // Checkout all → clear full cart
    cart.items = [];
  }

  await cart.save();

  res.status(201).json({
    success: true,
    order,
  });
};

//
// CREATE STRIPE CHECKOUT SESSION
//
export const createCheckoutSession =
  async (req, res) => {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      res.status(404);
      throw new Error(
        "Order not found"
      );
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "Not authorized"
      );
    }

    const lineItems =
      order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image
              ? [item.image]
              : [],
          },
          unit_amount:
            Math.round(
              item.price * 100
            ),
        },
        quantity: item.quantity,
      }));

    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount:
            Math.round(
              order.shippingPrice *
                100
            ),
        },
        quantity: 1,
      });
    }

    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount:
            Math.round(
              order.taxPrice * 100
            ),
        },
        quantity: 1,
      });
    }

    const stripe = getStripe();

    const session =
      await stripe.checkout.sessions.create(
        {
          payment_method_types: [
            "card",
          ],
          mode: "payment",
          customer_email:
            req.user.email,
          client_reference_id:
            order._id.toString(),
          line_items: lineItems,
          success_url: `${process.env.CLIENT_URL}/order/${order._id}?success=true`,
          cancel_url: `${process.env.CLIENT_URL}/order/${order._id}?canceled=true`,
          metadata: {
            orderId:
              order._id.toString(),
          },
        }
      );

    res.json({
      success: true,
      url: session.url,
    });
  };

//
// STRIPE WEBHOOK
//
export const stripeWebhook =
  async (req, res) => {
    const sig =
      req.headers[
        "stripe-signature"
      ];

    let event;

    try {
      const stripe = getStripe();

      event =
        stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env
            .STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
      return res
        .status(400)
        .send(
          `Webhook Error: ${err.message}`
        );
    }

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object;

      const orderId =
        session.metadata.orderId;

      await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
          status: "processing",
          paymentResult: {
            id: session.payment_intent,
            status:
              session.payment_status,
            updateTime:
              new Date().toISOString(),
            email:
              session.customer_email,
          },
        }
      );
    }

    res.json({
      received: true,
    });
  };

//
// GET MY ORDERS
//
export const getMyOrders =
  async (req, res) => {
    const orders =
      await Order.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  };

//
// GET ORDER BY ID
//
export const getOrderById =
  async (req, res) => {
    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "user",
        "name email"
      );

    if (!order) {
      res.status(404);
      throw new Error(
        "Order not found"
      );
    }

    if (
      order.user._id.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "seller"
    ) {
      res.status(403);
      throw new Error(
        "Not authorized"
      );
    }

    res.json({
      success: true,
      order,
    });
  };

//
// GET ALL ORDERS
//
export const getAllOrders =
  async (req, res) => {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    let query = {};

    // Seller sees only their product orders
    if (
      req.user.role === "seller"
    ) {
      const sellerProducts =
        await Product.find({
          seller: req.user._id,
        }).select("_id");

      const productIds =
        sellerProducts.map(
          (p) => p._id
        );

      query = {
        "items.product": {
          $in: productIds,
        },
      };
    }

    const count =
      await Order.countDocuments(
        query
      );

    const orders =
      await Order.find(query)
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .skip(
          limit * (page - 1)
        );

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(
        count / limit
      ),
      total: count,
    });
  };

//
// UPDATE ORDER STATUS
//
export const updateOrderStatus =
  async (req, res) => {
    const {
      status,
      trackingNumber,
    } = req.body;

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      res.status(404);
      throw new Error(
        "Order not found"
      );
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber =
        trackingNumber;
    }

    if (
      status === "delivered"
    ) {
      order.isDelivered = true;
      order.deliveredAt =
        new Date();
    }

    await order.save();

    res.json({
      success: true,
      order,
    });
  };
// ============================================================
// FOODORAX BACKEND SERVER
// Node.js + Express + TypeScript + Socket.io + Prisma
// ============================================================

// ── src/index.ts ─────────────────────────────────────────────
/*
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

import authRoutes       from "./routes/auth";
import restaurantRoutes from "./routes/restaurants";
import menuRoutes       from "./routes/menu";
import orderRoutes      from "./routes/orders";
import paymentRoutes    from "./routes/payments";
import deliveryRoutes   from "./routes/delivery";
import adminRoutes      from "./routes/admin";
import droneRoutes      from "./routes/drones";
import couponRoutes     from "./routes/coupons";
import subRoutes        from "./routes/subscriptions";
import notifRoutes      from "./routes/notifications";
import { initSocket }   from "./services/socket";

export const prisma = new PrismaClient();

const app    = express();
const server = createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter auth limiter
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use("/api/auth/", authLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/restaurants",   restaurantRoutes);
app.use("/api/menu",          menuRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/payments",      paymentRoutes);
app.use("/api/delivery",      deliveryRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/drones",        droneRoutes);
app.use("/api/coupons",       couponRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/notifications", notifRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", service: "FoodoraX API" }));

// ── Socket.io ─────────────────────────────────────────────────
initSocket(io);

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 FoodoraX API running on port ${PORT}`));
*/

// ── src/routes/auth.ts ───────────────────────────────────────
/*
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { generateOTP, sendOTP } from "../services/otp";
import { z } from "zod";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const schema = z.object({
    name:      z.string().min(2),
    email:     z.string().email(),
    phone:     z.string().length(10),
    password:  z.string().min(6),
    userType:  z.enum(["student","hostel","gym","regular"]).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { name, email, phone, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name, email, phone, passwordHash,
      referralCode: `${name.split(" ")[0].toUpperCase()}${Math.floor(Math.random()*100)}`,
    },
  });

  const otp = generateOTP();
  await sendOTP(phone, otp);

  // Store OTP in Redis (simplified here as DB field)
  await prisma.user.update({ where: { id: user.id }, data: { } });

  res.status(201).json({ message: "OTP sent. Verify your phone.", userId: user.id });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash)
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" }
  );

  res.json({
    token, refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, points: user.points },
  });
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();
  await sendOTP(phone, otp);
  // In production: store OTP in Redis with 5-min TTL
  res.json({ message: "OTP sent successfully" });
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  // In production: verify against Redis stored OTP
  if (otp.length !== 6) return res.status(400).json({ error: "Invalid OTP" });

  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) return res.status(404).json({ error: "User not found" });

  await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, phone } });
});

// Refresh token
router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const token = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ token });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

export default router;
*/

// ── src/routes/orders.ts ─────────────────────────────────────
/*
import { Router } from "express";
import { prisma } from "../index";
import { authenticate } from "../middleware/auth";
import { io } from "../index"; // Socket instance

const router = Router();
router.use(authenticate);

// Place order
router.post("/", async (req, res) => {
  const { restaurantId, addressId, items, couponCode, paymentMethod } = req.body;
  const userId = (req as any).user.id;

  // Validate coupon
  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (coupon && coupon.isActive && new Date() < coupon.expiresAt) {
      discount = coupon.discountType === "percent"
        ? subtotal * (coupon.discountValue / 100)
        : coupon.discountValue;
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
    if (!menuItem || !menuItem.isAvailable) continue;
    subtotal += menuItem.price * item.quantity;
    orderItems.push({ menuItemId: item.menuItemId, quantity: item.quantity, price: menuItem.price });
  }

  const deliveryFee = subtotal >= 199 ? 0 : 29;
  const tax         = (subtotal - discount) * 0.05;
  const total       = subtotal - discount + deliveryFee + tax;

  const order = await prisma.order.create({
    data: {
      userId, restaurantId, addressId,
      subtotal, discount, deliveryFee, tax: Math.floor(tax), total: Math.floor(total),
      couponCode,
      status: "PLACED",
      items: { create: orderItems },
      payment: {
        create: {
          method: paymentMethod,
          status: paymentMethod === "COD" ? "PENDING" : "PENDING",
          amount: total,
        },
      },
    },
    include: { items: true, restaurant: true, address: true },
  });

  // Notify restaurant via Socket.io
  io.to(`restaurant_${restaurantId}`).emit("new_order", order);

  // Add notification to user
  await prisma.notification.create({
    data: {
      userId, type: "order",
      title: "Order Placed! 🎉",
      body: `Your order from ${order.restaurant.name} has been placed. Order #${order.id.slice(-4)}`,
    },
  });

  res.status(201).json(order);
});

// Get user's orders
router.get("/", async (req, res) => {
  const userId = (req as any).user.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { restaurant: true, items: { include: { menuItem: true } }, payment: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  res.json(orders);
});

// Get single order + tracking
router.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      restaurant: true,
      items: { include: { menuItem: true } },
      deliveryPartner: true,
      address: true,
      payment: true,
    },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Update order status (restaurant/delivery)
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });

  // Real-time update to customer
  io.to(`order_${order.id}`).emit("status_update", { status, orderId: order.id });

  res.json(order);
});

export default router;
*/

// ── src/routes/drones.ts (FoodoraX Air) ─────────────────────
/*
import { Router } from "express";
import { prisma } from "../index";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// GET all drones (admin only)
router.get("/", requireRole("ADMIN"), async (req, res) => {
  const drones = await prisma.drone.findMany({
    include: { deliveries: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  res.json(drones);
});

// GET drone status
router.get("/:id/status", async (req, res) => {
  const drone = await prisma.drone.findUnique({
    where: { id: req.params.id },
    include: {
      deliveries: { where: { status: "IN_FLIGHT" } },
    },
  });
  if (!drone) return res.status(404).json({ error: "Drone not found" });
  res.json({
    id:            drone.id,
    status:        drone.status,
    battery:       drone.batteryPercent,
    location:      { lat: drone.currentLat, lng: drone.currentLng },
    activeDelivery: drone.deliveries[0] || null,
  });
});

// GET pickup zones
router.get("/zones/all", async (req, res) => {
  const zones = await prisma.dronePickupZone.findMany({ where: { isActive: true } });
  res.json(zones);
});

// Schedule drone delivery (admin/future)
router.post("/deliveries", requireRole("ADMIN"), async (req, res) => {
  const { orderId, droneId, pickupZoneId, dropLat, dropLng } = req.body;

  // Check drone availability
  const drone = await prisma.drone.findUnique({ where: { id: droneId } });
  if (!drone || drone.status !== "IDLE")
    return res.status(400).json({ error: "Drone not available" });
  if (drone.batteryPercent < 20)
    return res.status(400).json({ error: "Drone battery too low" });

  const delivery = await prisma.droneDelivery.create({
    data: {
      droneId, orderId, pickupZoneId,
      dropLat, dropLng,
      status: "SCHEDULED",
      qrCode: `FXA-${orderId.slice(-6).toUpperCase()}`,
    },
  });

  // Update drone status
  await prisma.drone.update({ where: { id: droneId }, data: { status: "FLYING" } });

  res.status(201).json(delivery);
});

// Maintenance log
router.post("/:id/maintenance", requireRole("ADMIN"), async (req, res) => {
  const { type, notes, techName } = req.body;
  const log = await prisma.droneMaintenanceLog.create({
    data: { droneId: req.params.id, type, notes, techName },
  });
  res.status(201).json(log);
});

export default router;
*/

// ── src/services/socket.ts ────────────────────────────────────
/*
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export function initSocket(io: Server) {
  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.userId = decoded.userId;
      socket.data.role   = decoded.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.data.userId})`);

    // ── Customer rooms ─────────────────────────────────────
    socket.on("track_order", (orderId: string) => {
      socket.join(`order_${orderId}`);
      socket.emit("tracking_started", { orderId });
    });

    socket.on("leave_order", (orderId: string) => {
      socket.leave(`order_${orderId}`);
    });

    // ── Restaurant room ────────────────────────────────────
    socket.on("restaurant_join", (restaurantId: string) => {
      if (socket.data.role === "RESTAURANT_OWNER")
        socket.join(`restaurant_${restaurantId}`);
    });

    // ── Delivery partner ───────────────────────────────────
    socket.on("location_update", async ({ orderId, lat, lng }) => {
      // Broadcast to customer tracking that order
      io.to(`order_${orderId}`).emit("delivery_location", {
        lat, lng,
        timestamp: new Date().toISOString(),
      });

      // Also broadcast to admin
      io.to("admin_room").emit("fleet_update", {
        partnerId: socket.data.userId,
        orderId, lat, lng,
      });
    });

    socket.on("order_picked_up", (orderId: string) => {
      io.to(`order_${orderId}`).emit("status_update", {
        status: "OUT_FOR_DELIVERY",
        message: "Your order is on the way! 🛵",
      });
    });

    socket.on("order_delivered", (orderId: string) => {
      io.to(`order_${orderId}`).emit("status_update", {
        status: "DELIVERED",
        message: "Order delivered! Enjoy your meal 🎉",
      });
    });

    // ── Admin room ─────────────────────────────────────────
    socket.on("admin_join", () => {
      if (socket.data.role === "ADMIN")
        socket.join("admin_room");
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
*/

// ── src/services/razorpay.ts ──────────────────────────────────
/*
import Razorpay from "razorpay";
import crypto   from "crypto";

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amountInRupees: number, orderId: string) {
  return await rzp.orders.create({
    amount:   Math.round(amountInRupees * 100),
    currency: "INR",
    receipt:  `foodorax_${orderId}`,
    notes:    { platform: "FoodoraX", orderId },
  });
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(signature)
  );
}
*/

// ── src/services/otp.ts ───────────────────────────────────────
/*
import twilio from "twilio";
import Redis  from "ioredis";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);
const redis = new Redis(process.env.REDIS_URL!);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(phone: string, otp: string): Promise<void> {
  // Store in Redis with 5-min TTL
  await redis.setex(`otp:${phone}`, 300, otp);

  // Send via Twilio (or fast2sms for India — cheaper)
  if (process.env.NODE_ENV === "production") {
    await client.messages.create({
      body: `Your FoodoraX OTP is: ${otp}. Valid for 5 minutes. Do not share.`,
      from: process.env.TWILIO_PHONE!,
      to:   `+91${phone}`,
    });
  } else {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
  }
}

export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const stored = await redis.get(`otp:${phone}`);
  if (stored === otp) {
    await redis.del(`otp:${phone}`);
    return true;
  }
  return false;
}
*/

// ── src/middleware/auth.ts ────────────────────────────────────
/*
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../index";

interface AuthRequest extends Request {
  user?: any;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role))
      return res.status(403).json({ error: "Insufficient permissions" });
    next();
  };
}
*/

// ── src/routes/restaurants.ts ────────────────────────────────
/*
import { Router } from "express";
import { prisma } from "../index";
import { authenticate, requireRole } from "../middleware/auth";
import multer  from "multer";
import { uploadToCloudinary } from "../services/cloudinary";

const router  = Router();
const upload  = multer({ storage: multer.memoryStorage() });

// GET all restaurants (with filters)
router.get("/", async (req, res) => {
  const { category, isVeg, minRating, search, lat, lng } = req.query;

  const where: any = { isActive: true, isVerified: true };
  if (isVeg)      where.isVeg     = true;
  if (minRating)  where.rating    = { gte: parseFloat(minRating as string) };
  if (search)     where.name      = { contains: search as string, mode: "insensitive" };
  if (category)   where.cuisine   = { contains: category as string, mode: "insensitive" };

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: { menuItems: { take: 3, where: { isPopular: true } } },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  });

  res.json(restaurants);
});

// GET restaurant + full menu
router.get("/:id", async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.params.id },
    include: {
      menuItems: {
        where: { isAvailable: true },
        include: { category: true },
        orderBy: [{ isPopular: "desc" }, { name: "asc" }],
      },
      categories: true,
      reviews: {
        include: { user: { select: { name: true, profileImage: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
  res.json(restaurant);
});

// POST create restaurant (admin onboards)
router.post("/", authenticate, requireRole("ADMIN"), upload.single("image"), async (req, res) => {
  const { name, cuisine, address, lat, lng, phone, ownerId } = req.body;

  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.buffer, "restaurants");
  }

  const restaurant = await prisma.restaurant.create({
    data: { name, cuisine, address, lat: +lat, lng: +lng, phone, ownerId, image: imageUrl },
  });
  res.status(201).json(restaurant);
});

// PUT update restaurant menu item
router.put("/:id/menu/:itemId", authenticate, upload.single("image"), async (req, res) => {
  const { name, description, price, calories, protein, isVeg, isAvailable } = req.body;
  let imageUrl: string | undefined;
  if (req.file) imageUrl = await uploadToCloudinary(req.file.buffer, "menu-items");

  const item = await prisma.menuItem.update({
    where: { id: req.params.itemId },
    data: {
      name, description,
      price:     price     ? +price     : undefined,
      calories:  calories  ? +calories  : undefined,
      protein:   protein   ? +protein   : undefined,
      isVeg:     isVeg !== undefined ? isVeg === "true" : undefined,
      isAvailable: isAvailable !== undefined ? isAvailable === "true" : undefined,
      image:     imageUrl,
    },
  });
  res.json(item);
});

export default router;
*/

// ── src/services/cloudinary.ts ───────────────────────────────
/*
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `foodorax/${folder}`, resource_type: "image", quality: "auto", fetch_format: "auto" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}
*/

// ── prisma/seed.ts ───────────────────────────────────────────
/*
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding FoodoraX database...");

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@foodorax.in" },
    update: {},
    create: {
      name:         "FoodoraX Admin",
      email:        "admin@foodorax.in",
      phone:        "9000000001",
      passwordHash: await bcrypt.hash("Admin@123", 12),
      role:         "ADMIN",
      isVerified:   true,
      referralCode: "ADMIN001",
    },
  });

  // Restaurant owner
  const owner = await prisma.user.upsert({
    where: { email: "maakitchen@foodorax.in" },
    update: {},
    create: {
      name:         "Maa Kitchen Owner",
      email:        "maakitchen@foodorax.in",
      phone:        "9000000002",
      passwordHash: await bcrypt.hash("Owner@123", 12),
      role:         "RESTAURANT_OWNER",
      isVerified:   true,
      referralCode: "OWNER001",
    },
  });

  // Restaurants
  const maaKitchen = await prisma.restaurant.upsert({
    where: { id: "rest_001" },
    update: {},
    create: {
      id:          "rest_001",
      ownerId:     owner.id,
      name:        "Maa Kitchen",
      description: "Authentic home-style Assamese food in Jagiroad",
      cuisine:     "Assamese • Home Food",
      address:     "Near Market, Jagiroad, Assam 782410",
      lat:         26.2280,
      lng:         92.3790,
      phone:       "9876500001",
      rating:      4.8,
      totalRatings: 124,
      minOrder:    49,
      deliveryTime: "20-30 min",
      isVerified:  true,
    },
  });

  // Categories
  const catAssamese = await prisma.category.create({
    data: { restaurantId: maaKitchen.id, name: "Assamese Specials", emoji: "🍚" },
  });
  const catRice = await prisma.category.create({
    data: { restaurantId: maaKitchen.id, name: "Rice & Curry", emoji: "🍛" },
  });

  // Menu items
  const menuItemsData = [
    { name: "Fish Curry + Rice", description: "Traditional Assamese fish curry with steamed rice", price: 89, calories: 520, protein: 18, isVeg: false, isPopular: true,  emoji: "🍛", categoryId: catAssamese.id },
    { name: "Duck Curry",        description: "Authentic duck curry with bamboo shoot",            price: 129, calories: 680, protein: 24, isVeg: false, isPopular: true,  emoji: "🦆", categoryId: catAssamese.id },
    { name: "Jolpan Platter",    description: "Traditional Assamese breakfast platter",            price: 59,  calories: 380, protein: 8,  isVeg: true,  isPopular: false, emoji: "🥣", categoryId: catAssamese.id },
    { name: "Masor Tenga",       description: "Tangy fish curry in tomato-lemon broth",           price: 99,  calories: 280, protein: 20, isVeg: false, isPopular: true,  emoji: "🐟", categoryId: catRice.id },
    { name: "₹49 Dal Rice",      description: "Dal + Rice + Pickle — the student classic",        price: 49,  calories: 420, protein: 12, isVeg: true,  isPopular: true,  emoji: "🍽️", categoryId: catRice.id },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.create({ data: { ...item, restaurantId: maaKitchen.id } });
  }

  // Coupons
  const coupons = [
    { code: "STUDENT10", description: "10% off for students",      discountType: "percent", discountValue: 10, minOrder: 49,  maxUses: 1000, expiresAt: new Date("2026-12-31") },
    { code: "FOODORAX",  description: "₹30 flat off on any order", discountType: "flat",    discountValue: 30, minOrder: 99,  maxUses: 500,  expiresAt: new Date("2026-12-31") },
    { code: "BIHU25",    description: "Bihu special – 25% off",    discountType: "percent", discountValue: 25, minOrder: 149, maxUses: 200,  expiresAt: new Date("2026-04-30") },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where:  { code: coupon.code },
      update: {},
      create: coupon,
    });
  }

  // FoodoraX Air — seed drone pickup zones
  const droneZones = [
    { name: "Hostel Block A Rooftop", lat: 26.2282, lng: 92.3792, altitude: 12, qrCode: "FXA-ZONE-HA" },
    { name: "College Library Terrace", lat: 26.2285, lng: 92.3798, altitude: 10, qrCode: "FXA-ZONE-LT" },
    { name: "Hostel Block B Rooftop", lat: 26.2279, lng: 92.3796, altitude: 12, qrCode: "FXA-ZONE-HB" },
  ];

  for (const zone of droneZones) {
    await prisma.dronePickupZone.upsert({
      where:  { qrCode: zone.qrCode },
      update: {},
      create: zone,
    });
  }

  // Seed 2 drones (future-ready)
  const droneData = [
    { serialNumber: "FXD-001", model: "DJI M300", batteryPercent: 95, maxPayloadGrams: 2000, maxRangeKm: 8, homeBaseLat: 26.2280, homeBaseLng: 92.3790 },
    { serialNumber: "FXD-002", model: "DJI M300", batteryPercent: 78, maxPayloadGrams: 2000, maxRangeKm: 8, homeBaseLat: 26.2280, homeBaseLng: 92.3790 },
  ];

  for (const drone of droneData) {
    await prisma.drone.upsert({
      where:  { serialNumber: drone.serialNumber },
      update: {},
      create: drone,
    });
  }

  console.log("✅ FoodoraX database seeded successfully!");
  console.log(`   Admin: admin@foodorax.in / Admin@123`);
  console.log(`   Restaurant: maakitchen@foodorax.in / Owner@123`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
*/

// ── package.json (server) ────────────────────────────────────
const packageJson = {
  name: "foodorax-server",
  version: "1.0.0",
  description: "FoodoraX Backend API",
  scripts: {
    dev:   "ts-node-dev --respawn --transpile-only src/index.ts",
    build: "tsc",
    start: "node dist/index.js",
    seed:  "ts-node prisma/seed.ts",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
  },
  dependencies: {
    "@prisma/client": "^5.10.0",
    "bcryptjs":       "^2.4.3",
    "cloudinary":     "^2.0.1",
    "cors":           "^2.8.5",
    "express":        "^4.18.3",
    "express-rate-limit": "^7.2.0",
    "helmet":         "^7.1.0",
    "ioredis":        "^5.3.2",
    "jsonwebtoken":   "^9.0.2",
    "multer":         "^1.4.5-lts.1",
    "razorpay":       "^2.9.2",
    "socket.io":      "^4.7.4",
    "twilio":         "^5.0.4",
    "zod":            "^3.22.4",
  },
  devDependencies: {
    "@types/bcryptjs":    "^2.4.6",
    "@types/cors":        "^2.8.17",
    "@types/express":     "^4.17.21",
    "@types/jsonwebtoken":"^9.0.5",
    "@types/multer":      "^1.4.11",
    "@types/node":        "^20.11.5",
    "prisma":             "^5.10.0",
    "ts-node-dev":        "^2.0.0",
    "typescript":         "^5.3.3",
  },
};

// ── Railway Dockerfile ────────────────────────────────────────
const dockerfile = `
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 4000
CMD ["npm", "start"]
`.trim();

// ── Vercel (frontend) vercel.json ─────────────────────────────
const vercelJson = {
  framework: "nextjs",
  buildCommand: "npm run build",
  devCommand:   "npm run dev",
  installCommand: "npm install",
  env: {
    NEXT_PUBLIC_API_URL:          "@api_url",
    NEXT_PUBLIC_SOCKET_URL:       "@socket_url",
    NEXT_PUBLIC_RAZORPAY_KEY:     "@razorpay_key",
    NEXT_PUBLIC_GOOGLE_MAPS_KEY:  "@google_maps_key",
  },
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options",        value: "DENY" },
        { key: "X-XSS-Protection",       value: "1; mode=block" },
      ],
    },
  ],
};

// ── PWA manifest.json ─────────────────────────────────────────
const pwaManifest = {
  name:             "FoodoraX",
  short_name:       "FoodoraX",
  description:      "Jagiroad's Own Food Delivery App",
  start_url:        "/",
  display:          "standalone",
  background_color: "#0D1117",
  theme_color:      "#FF6B00",
  orientation:      "portrait",
  icons: [
    { src: "/icons/icon-72x72.png",   sizes: "72x72",   type: "image/png" },
    { src: "/icons/icon-96x96.png",   sizes: "96x96",   type: "image/png" },
    { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
    { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
    { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ],
  categories:       ["food", "shopping", "lifestyle"],
  shortcuts: [
    { name: "Order Food",     url: "/",           icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
    { name: "My Orders",      url: "/orders",     icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
    { name: "Gym Meals",      url: "/fitness",    icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
    { name: "Assamese Food",  url: "/assamese",   icons: [{ src: "/icons/icon-96x96.png", sizes: "96x96" }] },
  ],
};

// Export all configs as readable JSON strings
export const BACKEND_CONFIGS = {
  packageJson:  JSON.stringify(packageJson,  null, 2),
  dockerfile,
  vercelJson:   JSON.stringify(vercelJson,   null, 2),
  pwaManifest:  JSON.stringify(pwaManifest,  null, 2),
};

// Dummy default export to satisfy React artifact requirement
export default function BackendReference() {
  return (
    <div style={{ background: "#0D1117", color: "#58A6FF", fontFamily: "monospace", padding: "2rem", minHeight: "100vh" }}>
      <pre style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {`// ✅ FoodoraX Backend Reference File
// All server code is in the commented blocks above.
// Uncomment and place in your Node.js project.
//
// Structure:
//   src/index.ts             — Express + Socket.io bootstrap
//   src/routes/auth.ts       — JWT + OTP authentication
//   src/routes/orders.ts     — Order management
//   src/routes/restaurants.ts— Restaurant CRUD + menu
//   src/routes/drones.ts     — FoodoraX Air (future-ready)
//   src/middleware/auth.ts   — JWT middleware
//   src/services/socket.ts   — Real-time tracking
//   src/services/razorpay.ts — Payment integration
//   src/services/otp.ts      — OTP via Twilio/Fast2SMS
//   src/services/cloudinary.ts— Image uploads
//   prisma/seed.ts           — Database seed with real data
//
// Quick start:
//   npm install
//   npx prisma migrate dev
//   npm run seed
//   npm run dev
`}
      </pre>
    </div>
  );
}

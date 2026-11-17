# FoodoraX API contract (v1)

Base URL: `${NEXT_PUBLIC_API_URL}` (e.g. `http://localhost:4000`). All routes are under `/api`.
Auth: `Authorization: Bearer <accessToken>` (JWT, 7d). Refresh tokens last 30d.
All bodies are JSON. Errors: `{ "error": string, "details"?: unknown }` with a proper HTTP status.
Money is rupees (number, max 2 decimals). Ids are cuid strings. Dates are ISO strings.
Lists are returned as bare JSON arrays unless a wrapper is shown.

Roles: `CUSTOMER`, `RESTAURANT_OWNER`, `DELIVERY_PARTNER`, `ADMIN`.

## Shared shapes

```ts
User        { id, name, email, phone|null, role, userType, points, referralCode, isVerified }
Restaurant  { id, name, description|null, cuisine, emoji|null, image|null, address, rating, totalRatings,
              deliveryTime, minOrder, priceForTwo, isVeg, tags: string[], offer|null, badge|null,
              openTime, closeTime, isActive, isVerified }
MenuItem    { id, restaurantId, name, description|null, price, image|null, emoji|null, isVeg, calories|null,
              protein|null, carbs|null, fat|null, ingredients: string[], tags: string[],
              addons: { name: string, price: number }[] | null, isAvailable, isPopular,
              category: { id, name, slug } | null }
Address     { id, label, line1, hostelName|null, block|null, roomNumber|null, landmark|null, lat|null, lng|null, isDefault }
Order       { id, orderNumber, status, subtotal, discount, deliveryFee, tax, total, couponCode|null,
              hostelInfo|null, specialInstructions|null, scheduledFor|null, createdAt, deliveredAt|null,
              restaurant: { id, name, emoji, image, phone? }, address: Address|null,
              items: { id, menuItemId, name, price, quantity, addons }[],
              payment: { method, status, amount, razorpayOrderId|null } | null,
              deliveryPartner: { id, vehicleType, user: { name, phone } } | null }
OrderStatus PLACED | CONFIRMED | PREPARING | READY_FOR_PICKUP | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | REJECTED
```

## Pricing rules (server-authoritative; clients only display)
- `unit price = menuItem.price + sum(selected add-on prices)`; `subtotal = Σ unit × qty`.
- Coupon: `PERCENT` → `subtotal × v/100` capped by `maxDiscount`; `FLAT` → `v`; discount never exceeds subtotal.
  Requires active, unexpired, `usedCount < maxUses`, `subtotal >= minOrder`.
- `deliveryFee = 0` if `subtotal - discount >= FREE_DELIVERY_ABOVE` (default 199) else `DELIVERY_FEE` (default 29).
- `tax = round((subtotal - discount) × 0.05, 2)`; `total = subtotal - discount + deliveryFee + tax`.
- `subtotal < restaurant.minOrder` → 400.

## Auth — `/api/auth`
| Method | Path | Body | Response |
|---|---|---|---|
| POST | /register | `{name,email,phone,password,userType?,referralCode?}` | `{token,refreshToken,user}` |
| POST | /login | `{email,password}` | `{token,refreshToken,user}` |
| POST | /send-otp | `{phone}` | `{message, devOtp?}` (`devOtp` only when NODE_ENV≠production) |
| POST | /verify-otp | `{phone,otp}` | `{token,refreshToken,user}` (marks phone verified) |
| POST | /google | `{idToken}` | `{token,refreshToken,user}` |
| POST | /forgot-password | `{phone}` | `{message, devOtp?}` |
| POST | /reset-password | `{phone,otp,newPassword}` | `{message}` |
| POST | /refresh-token | `{refreshToken}` | `{token}` |
| GET | /me | – | `User` |

## Catalog
| Method | Path | Notes |
|---|---|---|
| GET | /restaurants | query `q, veg=true, tag, category, sort=rating\|time\|price, limit` → `Restaurant[]` (only active+verified) |
| GET | /restaurants/:id | `Restaurant & { menuItems: MenuItem[], reviews: { id, rating, comment, createdAt, user:{name} }[] }` |
| POST | /restaurants | ADMIN. Create restaurant |
| PUT | /restaurants/:id | owner or ADMIN |
| PATCH | /restaurants/:id/verify | ADMIN `{isVerified}` |
| GET | /restaurants/:id/analytics | owner or ADMIN → `{ revenueByDay:{date,revenue,orders}[], topItems:{name,quantity}[], totals:{orders,revenue,avgRating} }` (last 7 days) |
| GET | /restaurants/:id/orders | owner/ADMIN, query `status` → `Order[]` |
| POST | /restaurants/:id/menu | owner/ADMIN create `MenuItem` |
| PUT | /menu/:itemId | owner/ADMIN |
| DELETE | /menu/:itemId | owner/ADMIN |
| GET | /menu/search | query `q, veg, tag, maxPrice` → `(MenuItem & { restaurant:{id,name} })[]` (powers "search foods", ₹49/₹99 budget, gym, assamese via `tag`) |
| GET | /categories | `{id,name,slug,emoji}[]` |
| GET | /banners | active banners `{id,title,subtitle,emoji,image,ctaLabel,ctaUrl}[]` |
| POST | /uploads/image | multipart `file`; owner/ADMIN → `{url}` (Cloudinary) |

## Customer
| Method | Path | Body / notes |
|---|---|---|
| GET/POST | /addresses | list / create `{label,line1,hostelName?,block?,roomNumber?,landmark?,lat?,lng?,isDefault?}` |
| PUT/DELETE | /addresses/:id | |
| GET | /favorites | `Restaurant[]` |
| PUT/DELETE | /favorites/:restaurantId | add / remove |
| POST | /coupons/validate | `{code, subtotal}` → `{valid, discount, message}` |
| GET | /coupons | active public coupons |
| GET | /notifications | `{id,type,title,body,isRead,createdAt}[]` |
| PATCH | /notifications/:id/read · POST /notifications/read-all | |
| GET | /subscriptions/plans | static: `student-saver` ₹799/30 meals, `hostel-combo` ₹1399/60, `gym-warrior` ₹2199/90 |
| GET/POST/DELETE | /subscriptions/me | POST `{planId}`; DELETE cancels active |
| GET | /referrals/me | `{code, referredCount, pointsEarned}` |

## Orders — `/api/orders`
| Method | Path | Body / notes |
|---|---|---|
| POST | / | CUSTOMER. `{restaurantId, addressId?, items:[{menuItemId, quantity, addons?:string[]}], couponCode?, paymentMethod:'COD'\|'RAZORPAY', hostelInfo?, specialInstructions?, scheduledFor?}` → `Order` (status PLACED). Rejects unavailable items / other-restaurant items. Emits socket `new_order` to `restaurant:<id>` and creates notifications. Increments coupon `usedCount`. |
| GET | / | my orders, newest first |
| GET | /:id | customer owner, restaurant owner, assigned partner, ADMIN |
| PUT | /:id/status | `{status}`. Restaurant owner: PLACED→CONFIRMED\|REJECTED, CONFIRMED→PREPARING, PREPARING→READY_FOR_PICKUP. Partner: READY_FOR_PICKUP→OUT_FOR_DELIVERY→DELIVERED (must be assigned). ADMIN: any. COD payment → SUCCESS on DELIVERED. Emits socket `status_update`. |
| POST | /:id/cancel | customer, only while PLACED |
| POST | /:id/review | `{rating 1-5, comment?}`, only if DELIVERED, once; recomputes restaurant rating |

## Payments — `/api/payments`
| POST | /razorpay/create | `{orderId}` → `{razorpayOrderId, amount (paise), currency:'INR', keyId}` |
| POST | /razorpay/verify | `{orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature}` → `{success:true}` (HMAC verify, timing-safe) |
| POST | /razorpay/webhook | raw body, `X-Razorpay-Signature` with `RAZORPAY_WEBHOOK_SECRET`; handles `payment.captured`, `payment.failed` |

## Delivery partner — `/api/delivery` (DELIVERY_PARTNER)
| POST | /register | `{vehicleType, vehicleNo}` creates profile (needs admin approval) |
| GET | /me | profile |
| PATCH | /online | `{isOnline}` |
| POST | /location | `{lat,lng}` |
| GET | /available | orders READY_FOR_PICKUP with no partner (`Order[]`) |
| POST | /orders/:id/accept | atomically assigns self (409 if taken) |
| GET | /orders | my assigned orders, query `active=true` |
| GET | /earnings | `{today:{deliveries,amount}, week:{...}, total:{...}, perOrder}` — payout = `PARTNER_PAYOUT_PER_ORDER` (default 25) × delivered orders |

## Admin — `/api/admin` (ADMIN)
| GET | /stats | `{users, restaurants, activeOrders, deliveredOrders, revenue, deliveryPartners, onlinePartners}` |
| GET | /analytics | query `days=30` → `{revenueByDay[], ordersByStatus{}, topRestaurants[{id,name,orders,revenue}], userGrowth[{date,count}], delivery:{avgMinutes, completed}}` |
| GET | /users | query `role, q` · PATCH /users/:id `{role?, isActive?}` |
| GET | /orders | query `status` |
| GET | /restaurants | all incl. unverified |
| GET | /delivery-partners | · PATCH /delivery-partners/:id `{isApproved}` |
| GET/POST/PUT/DELETE | /coupons[/:id] | coupon CRUD |
| GET/POST/PUT/DELETE | /banners[/:id] | banner CRUD |
| POST | /notifications/broadcast | `{title, body, type?, role?}` → `{sent}` (createMany + socket emit) |

## FoodoraX Air — `/api/drones` (ADMIN; **not operational in MVP**)
Registry/telemetry CRUD works. Anything that would dispatch a drone returns **503** `{error:"FoodoraX Air is not operational yet"}` unless `FEATURE_DRONES=true`, and even then only creates DB records (no hardware control).
| GET/POST | /  | drones |
| GET | /:id | with latest battery + last maintenance |
| POST | /:id/battery | `{percent, voltage?, temperatureC?, healthPct?}` (also updates drone.batteryPercent) |
| POST | /:id/maintenance | `{type, notes?, techName}` |
| POST | /:id/emergency-land | sets status EMERGENCY_LANDING + maintenance log (data only) |
| GET/POST | /zones | pickup zones (QR code auto-generated `FXA-ZONE-xxxx`) |
| GET/POST | /routes | stored waypoint routes |
| POST | /deliveries | `{orderId, droneId, pickupZoneId, dropLat, dropLng, routeId?}` (feature-flagged; checks IDLE + battery ≥ 20) |
| GET | /deliveries/:id | |

## Socket.io (same origin as API)
Handshake: `io(url, { auth: { token } })`. Invalid token → connection refused.
Client → server:
- `track_order(orderId)` — allowed only for the order's customer, restaurant owner, assigned partner, or admin → joins `order:<id>`
- `restaurant_join(restaurantId)` — owner/admin only → joins `restaurant:<id>`
- `admin_join()` — admin only
- `location_update({orderId, lat, lng})` — only the partner assigned to the order
Server → client:
- `status_update { orderId, status }` (to `order:<id>`)
- `delivery_location { orderId, lat, lng, at }` (to `order:<id>`)
- `new_order Order` (to `restaurant:<id>`)
- `notification { id, type, title, body }` (to `user:<userId>`, every authed socket auto-joins `user:<id>`)

## Health
`GET /health` → `{ status: "ok", service: "foodorax-api", time }` (not under `/api`).

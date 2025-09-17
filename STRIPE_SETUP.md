# Stripe Payment Setup

## Phase 1 - Stripe Integration

This document explains how to set up Stripe payments for the pizza ordering website.

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe (use my keys NOW; I will replace with client's later)
STRIPE_SECRET_KEY=sk_live_or_test_from_me
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_from_me

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_placeholder   # to be set after we create the webhook

# App
APP_BASE_URL=http://localhost:3000         # or https://my-domain.com for production
```

### 2. Stripe CLI Setup (for local development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to your Stripe account: `stripe login`
3. Forward webhooks to local development: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret and update `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 3. Test Card Numbers

Use these test card numbers for testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995
- **Expired card**: 4000 0000 0000 0069

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

### 4. Testing the Integration

1. Start the development server: `npm run dev`
2. Add items to cart from the menu
3. Go to checkout and fill in customer details
4. Select "Credit/Debit Card" payment method
5. Click "Pay with Stripe" - this will redirect to Stripe Checkout
6. Use test card numbers to complete payment
7. You'll be redirected to the success page

### 5. Webhook Testing

The webhook endpoint is set up at `/api/stripe/webhook` and will:
- Mark orders as paid when `checkout.session.completed` event is received
- Handle payment failures with `payment_intent.payment_failed` event

### 6. Production Setup

When ready for production:
1. Replace test keys with live keys in `.env.local`
2. Update `APP_BASE_URL` to your production domain
3. Create webhook endpoint in Stripe Dashboard pointing to your production URL
4. Update `STRIPE_WEBHOOK_SECRET` with the production webhook secret

### 7. Current Implementation Status

✅ **Phase 1 - Stripe Payments (Completed):**
- Stripe Checkout Session creation
- Webhook handling for payment completion
- Success page with order details
- Form integration with Stripe checkout
- Environment variable configuration

✅ **Phase 2 - Order Tracking Backbone (Completed):**
- Order schema and database structure
- Order tracking API endpoints
- Public tracking page for customers
- Admin page for order management
- Status update system

✅ **Phase 3 - Real-Time Updates (Completed):**
- Socket.io server setup with custom Next.js server
- Real-time order status updates
- Live tracking page with connection status
- Admin page with live updates
- Socket.io context and hooks for frontend

✅ **Phase 4 - Advanced Live GPS Tracking (Completed):**
- Rider web app with GPS location tracking
- Live map integration with Leaflet
- Real-time rider location updates
- Rider assignment system
- Live delivery tracking for customers

🎉 **All Phases Complete!**

### 8. Testing the Order Tracking System

1. **Place an order** through the normal checkout flow
2. **Visit the admin page** at `/admin/orders` to see all orders
3. **Update order status** using the dropdown in the admin panel
4. **Test tracking page** by visiting `/track/[TRACKING_CODE]`
5. **Verify status updates** are reflected on the tracking page

### 9. Testing Real-Time Updates (Phase 3)

1. **Start the server** with Socket.io: `npm run dev`
2. **Open two browser windows:**
   - Window 1: Admin page (`/admin/orders`)
   - Window 2: Tracking page (`/track/[TRACKING_CODE]`)
3. **Update order status** in the admin window
4. **Verify real-time updates** appear instantly in the tracking window
5. **Check connection status** indicators on both pages

### 10. Testing GPS Tracking (Phase 4)

1. **Start the server**: `npm run dev`
2. **Open three browser windows:**
   - Window 1: Admin page (`/admin/orders`)
   - Window 2: Rider app (`/rider`) - login with any email
   - Window 3: Tracking page (`/track/[TRACKING_CODE]`)
3. **In the rider app:**
   - Click "Go Online"
   - Click "Start Tracking" (allow location access)
4. **In the admin page:**
   - Update order status to "preparing"
   - Assign a rider to the order
   - Update status to "out for delivery"
5. **In the tracking page:**
   - Verify the map appears
   - Watch the rider's live location updates
   - See the rider marker moving on the map

### 11. Order Status Flow

The system supports the following order statuses:
- `pending_payment` - Waiting for payment
- `paid` - Payment confirmed
- `preparing` - Order being prepared
- `baking` - Pizza in the oven
- `out_for_delivery` - On the way
- `delivered` - Order completed

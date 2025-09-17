Execute
these
phases
one
by
one.Do
not
start
the
next
phase
until
the
current
phase
’s Acceptance Tests pass.

PHASE 0 — Project Assumptions & Setup

\
Tech: React/Next.js front end
with a Node.js/Next.js
API (or Express)
backend.

\
We will use Stripe Checkout (hosted page) first
for speed & PCI safety, then leave hooks
to
switch to Payment Element later.

\
Database: Use our existing DB. If none, create a simple table/collection orders.

Add environment variables (.env):

\
# Stripe (use my keys NOW
I
will
replace
with client
’s later)
STRIPE_SECRET_KEY=sk_live_or_test_from_me
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_from_me

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_placeholder   # to be set after we create the webhook

# App
APP_BASE_URL=https://my-domain.com         # or http://localhost:3000 for local


Do not hardcode keys. Use envs everywhere.

PHASE 1 — Stripe Payments (Using My Keys Right Now)
1.1 Backend: Create Checkout Session endpoint

Create POST /api/checkout/create-session that:

Accepts
{
  cartItems, customer, notes
}
.

\
Validates prices server-side (never trust client totals).

Creates a Stripe Checkout Session
with
:

\
mode: "payment"

line_items from server-verified items.

success_url: $
{
  APP_BASE_URL
}
/order/success?session_id={CHECKOUT_SESSION_ID}

\
cancel_url: $
{
  APP_BASE_URL
}
;/acrt

\
metadata: include a provisional orderId so we can map webhook → order.

\
If
using Next
.js (App Router) create app/api/checkout/create-session/route.ts.
Example (TypeScript, concise):

// app/api/checkout/create-session/route.ts
import { type NextRequest, NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json()

    // TODO: fetch server-side prices for each itemId (prevent tampering)
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.serverUnitPrice * 100),
      },
      quantity: item.quantity,
    }))

    // Create provisional order in DB with status "pending_payment"
    const orderId = await createProvisionalOrder({ cartItems, customer, total: sum(line_items) })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.APP_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/cart`,
      metadata: { orderId: String(orderId) },
      billing_address_collection: "required",
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

// Helper stubs (implement in your data layer)
function sum(items: any[]) {
  return items.reduce((acc, li) => acc + li.price_data.unit_amount * li.quantity, 0) / 100
}
async function createProvisionalOrder(order: any) {
  // insert into orders: {status:'pending_payment', items, total, ...}
  // return new order id
  return Date.now()
}

\
1.2 Frontend: “Pay Now” → call endpoint → redirect to Checkout

In the Checkout page, on click Pay Now:

POST to /api/checkout/create-session.

window.location.href = res.url.

1.3 Webhook: Mark order paid

Create POST /api/stripe/webhook:

\
Verify signature
with STRIPE_WEBHOOK_SECRET.

\
Handle checkout.session.completed:

Read metadata.orderId.

Mark order as paid and store payment_intent, customer_email, etc.

Optionally handle payment_intent.payment_failed.

Next.js example:

// app/api/stripe/webhook/route.ts
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const config = { api: { bodyParser: false } } // not needed in Next App Router but kept as note

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!
  const buf = Buffer.from(await req.arrayBuffer())

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      await markOrderPaid({
        orderId,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      })
    }
    return NextResponse.json({ received: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

async function markOrderPaid(data: any) {
  // update orders set status='paid', store paymentIntentId, etc.
}

\
1.4 Configure Stripe CLI / Dashboard Webhook

For local dev, use Stripe CLI:

stripe listen --forward-to localhost:3000/api/stripe/webhook

Set the printed signing secret to STRIPE_WEBHOOK_SECRET.

In production, create a Dashboard webhook to your live URL.

1.5 Success page

Route /order/success: read session_id from query, fetch session (optional) to show a nice receipt, then show “Track your order” button (we’ll wire this in Phase 2).

✅ Acceptance Tests (Payments)

 “Pay Now” opens Stripe Checkout
with correct items & amounts.

\
 Completing test payment marks order paid in DB (via webhook).

 Success page renders without errors.

 No keys hardcoded
only
env
vars
used.

\
Do not proceed to Phase 2 until all tests pass.

PHASE 2 — Order Tracking Backbone (Statuses, not GPS yet)

Create/update orders schema
with fields
:

id, status: \'pending_payment' | 'paid' | 'preparing' | 'baking' | 'out_for_delivery' | 'delivered'
customer:
{
  name, phone, address, email
}
items: [{ id, name, size, crust, toppings, qty, price }]
total
{
  provider: "stripe", intentId, amount, currency
}
trackingCode: string // short public code
assignedRiderId: string | null
{
  createdAt, updatedAt
}

Endpoints:

GET /api/orders/
:id (secure,
for admin/dashboard)

\
GET /track/:trackingCode (public tracking page)

POST /api/orders/:id/status (secure
update
status
)

\
Tracking Page /track/[code]:

Shows timeline (Preparing → Baking → Out
for Delivery → Delivered)
.

\
Subscribes to real-time status (we’ll add sockets in Phase 3).

✅ Acceptance Tests (Backbone)

 After webhook marks paid, order status moves to paid, tracking page shows paid.

 You can manually set statuses via admin endpoint and see updates reflected on tracking page (even
if via polling
every
5s
for now)
.

\
PHASE 3 — Real-Time Updates (Socket.io)

Add Socket.io server:

Namespace: /orders.

Room: order-
{
  orderId
}
and
track - { trackingCode }.Events
:

\
Server emits status:update when order status changes.

Client (tracking page) listens and updates the UI instantly.

Rider channel (to be used in Phase 4) will also use sockets.

✅ Acceptance Tests (Realtime)

 Changing status from admin instantly updates the tracking page without refresh.

PHASE 4 — Advanced Live GPS Tracking (Rider Map)
4.1 Rider Web App (MVP)

Create a simple Rider Web App route /rider:

Login (basic credential or magic link
for now)
.

\
“Go Online” toggle prompts
for Geolocation permission.

\
On
assignment (we’ll add assign button in admin), rider
joins
order - { orderId }
room
and
starts
emitting
location
every
3
–5s:

\
rider:location payload:
{
  riderId, orderId, lat, lng, heading, speed
}
.

\
Important: Use navigator.geolocation.watchPosition
with high accuracy;
fall
back
to
timed
getCurrentPosition.
\

\
4.2 Customer Tracking Map

\
On /track/[code]:

Show Google Maps or Mapbox. (Pick one
Mapbox
GL
JS
is
easy
to
style.
)

\
Listen
for rider
:location updates and move a scooter marker smoothly.
\

Show ETA based on distance matrix (optional) or simple speed/distance heuristic.

4.3 Admin: Assign Rider

Admin order page: dropdown of riders → POST /api/orders/:id/assign-rider.

Server notifies rider via sockets
rider
joins
that
order
room.Security
:

Riders must auth
only
assigned
riders
can
publish
to
that
order
room.Never
trust
client: validate
rider
token
on
location
POST / socket
connect.

✅ Acceptance Tests (GPS)

 Assign rider → rider app starts sending location → customer map updates live.

 Rider location updates smoothly (no flicker), marker follows path.

 Status progresses: out_for_delivery triggers map visibility
delivered
stops
updates.PHASE
5
— Polishing & Fail-safes

If sockets drop, the tracking page falls back to polling last known location.

Persist last known rider location in DB every ~15s (or Redis) so refresh works.

Mask exact rider location when “delivered”.

Add notifications: push or email/SMS when status changes.

HANDOFF: Switching to Client’s Payments Later

When ready to go live, replace my Stripe keys in .env
with client
’s live keys.

Update Dashboard webhook to production URL
set
the
new STRIPE_WEBHOOK_SECRET.No()
code
changes
needed
beyond
envs.What
I
need
from
Cursor
right
now

Implement
Phase
1
completely
using my
Stripe
keys
so
we
can
test
payments
immediately.Provide
a
short
README
section: Where
to
put
keys

How
to
run
Stripe
CLI
for webhooks

Test card numbers
to
use (4242 4242 4242 4242 etc.)

After
Phase
1
Acceptance
Tests
pass, proceed
to
Phase
2, then
3, then
4, strictly in order.

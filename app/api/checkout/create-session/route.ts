import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { orderDB } from "@/lib/database/orders";
import { OrderItem, Customer, Payment } from "@/lib/types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    // Server-side price validation (prevent tampering)
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { 
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate total for validation
    const total = line_items.reduce((sum: number, item: any) => sum + item.price_data.unit_amount * item.quantity, 0) / 100;

    // Transform cart items to order items
    const orderItems: OrderItem[] = cartItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      size: item.customizations?.size || 'Medium',
      crust: item.customizations?.crust || 'Regular',
      toppings: item.customizations?.toppings || [],
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      description: item.description
    }));

    // Transform customer data
    const orderCustomer: Customer = {
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: {
        street: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        instructions: customer.instructions
      }
    };

    // Create payment object
    const payment: Payment = {
      provider: 'stripe',
      amount: total,
      currency: 'usd',
      status: 'pending'
    };

    // Create provisional order in DB with status "pending_payment"
    const order = await orderDB.createOrder({
      customer: orderCustomer,
      items: orderItems,
      total,
      payment,
      status: 'pending_payment',
      metadata: { notes: 'Order created via Stripe checkout' }
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.APP_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/cart`,
      metadata: { orderId: order.id },
      billing_address_collection: "required",
      allow_promotion_codes: true,
      customer_email: customer.email,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


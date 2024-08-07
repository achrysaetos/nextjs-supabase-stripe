import { supabase } from "../../../utils/supabase";
import cookie from "cookie";
import initStripe from "stripe";

// API call to get user from session cookie, then charge them
const handler = async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = cookie.parse(req.headers.cookie)["sb:token"];

  supabase.auth.session = () => ({
    access_token: token,
  });

  // Get stripe customer from session user
  const {
    data: { stripe_customer },
  } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { priceId } = req.query;

  const lineItems = [
    {
      price: priceId,
      quantity: 1,
    },
  ];

  // Charge the customer
  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/dashboard`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard`,
  });

  res.send({
    id: session.id,
  });
};

export default handler;

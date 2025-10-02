# CartPanda Webhook Handler

This Supabase Edge Function handles incoming webhooks from CartPanda and automatically creates user accounts in Supabase when purchases are made.

## Setup

### 1. Deploy the Function

```bash
supabase functions deploy cartpanda-webhook
```

### 2. Set Environment Variables

Set the required secrets for the function:

```bash
supabase secrets set CARTPANDA_SHOP_TOKEN="UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp"
```

The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available in Supabase Edge Functions.

### 3. Configure CartPanda Webhook

1. Go to your CartPanda dashboard for shop "ondigital"
2. Navigate to Settings > Webhooks (or API/Integrations section)
3. Create a new webhook with:
   - **Event**: Purchase/Order Created (or similar purchase event)
   - **URL**: `https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook`
   - **Headers** (optional for extra security):
     - `x-shop-token`: `UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp`

### 4. Test the Webhook

You can test the webhook manually using curl:

```bash
curl -X POST https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -H "x-shop-token: UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp" \
  -d '{
    "event": "purchase.completed",
    "data": {
      "order": {
        "customer": {
          "email": "test@example.com"
        }
      }
    }
  }'
```

## How It Works

1. CartPanda sends a POST request to the webhook URL when a purchase is made
2. The function extracts the customer email from the webhook payload
3. Checks if a user with that email already exists
4. If not, creates a new Supabase user with:
   - Email: from the purchase
   - Password: `123456`
   - Email confirmed: `true` (auto-confirmed)

## Security

The function validates the shop token to ensure requests are coming from your CartPanda shop. The token can be sent via:
- `x-shop-token` header
- `Authorization: Bearer TOKEN` header

## Payload Structure

The function handles various CartPanda webhook payload structures:
- `data.order.customer.email`
- `data.customer.email`
- `data.email`

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

## Debugging

### 1. Watch Real-Time Logs

Monitor function logs in real-time to see incoming requests:

```bash
supabase functions logs cartpanda-webhook --follow
```

This will show:
- Incoming webhook requests with headers
- Token validation status
- Full webhook payload
- Email extraction process
- User creation status
- Any errors

### 2. Test Locally

Run the test script to manually trigger the webhook:

```bash
./test-webhook.sh
```

This creates a test user with a timestamped email.

### 3. Check Supabase Dashboard

After a webhook is triggered:
1. Go to your Supabase Dashboard → Authentication → Users
2. Verify the new user was created with the correct email
3. Check that the user is confirmed (green check)

### 4. Manual Testing

Test different payload structures:

```bash
# Test with order.customer.email structure
curl -X POST https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -H "x-shop-token: UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp" \
  -d '{
    "event": "purchase.completed",
    "data": {
      "order": {
        "customer": {
          "email": "test1@example.com"
        }
      }
    }
  }'

# Test with customer.email structure
curl -X POST https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -H "x-shop-token: UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp" \
  -d '{
    "event": "purchase.completed",
    "data": {
      "customer": {
        "email": "test2@example.com"
      }
    }
  }'
```

### 5. CartPanda Webhook Test

Most webhook systems have a "Test Webhook" button in their dashboard:
1. Go to CartPanda webhook settings
2. Look for "Test" or "Send Test Event" button
3. This will send a sample payload to your endpoint
4. Check the logs to see if it was received

### Common Issues

**No logs appearing:**
- Function may not be deployed: `supabase functions deploy cartpanda-webhook`
- Wrong function name in logs command

**401 Unauthorized:**
- Shop token not set: `supabase secrets set CARTPANDA_SHOP_TOKEN="..."`
- Token mismatch: Check the token in CartPanda matches your secret

**400 No email found:**
- CartPanda payload structure is different
- Check logs for full payload structure
- Update email extraction logic if needed

**User already exists:**
- This is normal if testing multiple times
- Use different emails for each test

# CartPanda Webhook Handler

This Supabase Edge Function handles incoming webhooks from CartPanda and automatically creates user accounts in Supabase when purchases are made.

## Setup

### 1. Deploy the Function

```bash
supabase functions deploy cartpanda-webhook
```

### 2. Configure CartPanda Webhook

**Note:** No environment variables needed! The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available in Supabase Edge Functions.

1. Go to your CartPanda dashboard for shop "ondigital"
2. Navigate to Settings > Webhooks (or API/Integrations section)
3. Create a new webhook with:
   - **Event**: Purchase/Order Fulfilled (or the event you want to trigger on)
   - **URL**: `https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook`

### 3. Test the Webhook

You can test the webhook manually using curl:

```bash
curl -X POST https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.fulfilled",
    "order": {
      "id": 12345,
      "email": "test@example.com",
      "customer": {
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User"
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

The webhook is configured to accept all incoming requests from CartPanda without token validation, as CartPanda does not send custom authentication headers. The webhook is protected by:
- Being a non-obvious URL
- CORS headers
- Supabase's built-in security

## Payload Structure

CartPanda sends webhooks with this structure:
```json
{
  "event": "order.fulfilled",
  "order": {
    "id": 40586315,
    "email": "customer@example.com",
    "customer": {
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

The function extracts email from:
- `order.email` (primary)
- `order.customer.email` (fallback)

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
# Test with CartPanda structure
curl -X POST https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.fulfilled",
    "order": {
      "id": 12345,
      "email": "test@example.com",
      "customer": {
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User"
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

# CartPanda Webhook Setup - Complete Guide

## ✅ What's Done

Your webhook is **deployed and working** with the real CartPanda payload structure!

### Webhook URL
```
https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook
```

### What It Does
- ✅ Receives CartPanda `order.fulfilled` webhook events
- ✅ Extracts customer email from `order.email`
- ✅ Creates Supabase user with email and password `123456`
- ✅ Auto-confirms the user's email
- ✅ Handles duplicate users gracefully (returns success if user exists)

## 🚀 Next Steps - Configure CartPanda

1. **Go to your CartPanda dashboard** for shop "ondigital"
2. **Navigate to Webhooks/API settings**
3. **Create a new webhook:**
   - **Event**: Select "Order Fulfilled" (or the paid event you want)
   - **URL**: `https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook`

## 🧪 Testing

### Test Manually
```bash
./test-webhook.sh
```

This creates a user with a timestamped email so you can test multiple times.

### View Logs
Open this URL in your browser to see webhook activity in real-time:
```
https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook/logs
```

### View Created Users
Check users created by the webhook:
```
https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/auth/users
```

## 📊 How It Works

When a customer completes a purchase in CartPanda:

1. **CartPanda sends webhook** → Your Supabase function
2. **Function extracts email** → From `order.email`
3. **Creates Supabase user**:
   - Email: customer's email from purchase
   - Password: `123456`
   - Email confirmed: `true`
4. **Returns success** → CartPanda receives confirmation

## 🔍 Debug Webhook (Optional)

If you need to see the raw payload CartPanda sends:

**Debug URL:**
```
https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-debug
```

**Debug Logs:**
```
https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-debug/logs
```

Use the debug webhook to inspect the exact structure CartPanda sends, then switch back to the main webhook.

## 📝 Example Payload

CartPanda sends webhooks in this format:

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

## ✅ Test Results

Successfully tested with:
- Email: `webhook@teste.com` ✅
- User created with ID: `9b5f5d99-5b9f-4d6d-9131-404e5758773e`
- Password: `123456`
- Status: Email confirmed ✅

## 🔒 Security

- Webhook accepts requests from CartPanda (no token validation needed)
- Protected by non-obvious URL
- CORS headers configured for cross-origin requests
- Duplicate user handling (won't create multiple accounts for same email)

## 📞 Support

If the webhook isn't working:
1. Check the logs URL above
2. Look for error messages
3. Verify the shop token is set correctly
4. Test with the debug webhook to see raw payloads

## 🎉 You're All Set!

Once you configure the webhook in CartPanda, every purchase will automatically create a Supabase user account!

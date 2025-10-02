# CartPanda Debug Webhook

A super simple webhook to see exactly what CartPanda is sending.

## Purpose

This webhook does NOT create users or process anything. It just:
1. ✅ Receives the webhook request
2. ✅ Logs EVERYTHING (headers, body, raw data)
3. ✅ Returns success

## Webhook URL

```
https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-debug
```

## How to Use

### 1. Test Manually

```bash
./test-cartpanda-debug.sh
```

### 2. Configure in CartPanda

Use this URL in your CartPanda webhook settings:
```
https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-debug
```

### 3. View Logs

Open this page and keep it open:
```
https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-debug/logs
```

### 4. Trigger a Purchase

- Make a test purchase in CartPanda
- OR use CartPanda's "Test Webhook" button

### 5. Check Logs

You'll see complete output like:

```
🔔 NEW WEBHOOK REQUEST RECEIVED!
📅 Timestamp: 2025-10-02T12:34:56.789Z
🔗 Method: POST

📋 ALL HEADERS:
  content-type: application/json
  x-shop-token: ...
  user-agent: CartPanda/1.0

📦 RAW BODY:
{"event":"purchase.completed","data":{...}}

📦 PARSED JSON BODY:
{
  "event": "purchase.completed",
  "data": {
    "order": {
      ...
    }
  }
}

✅ REQUEST LOGGED SUCCESSFULLY
```

## What This Tells You

From the logs, you'll discover:
- ✅ Exact payload structure CartPanda uses
- ✅ Where the customer email is located
- ✅ What headers CartPanda sends
- ✅ What the event type is called
- ✅ Any authentication tokens/signatures they use

## After You Know the Structure

Once you see the real CartPanda payload:
1. Copy the payload structure from the logs
2. Update the main `cartpanda-webhook` function
3. Deploy the updated function
4. Switch CartPanda to use the main webhook

## No Security

This debug webhook accepts ALL requests (no token validation).
- ⚠️ Don't use this in production
- ⚠️ Only use for testing/debugging
- ✅ Switch to `cartpanda-webhook` once you know the payload structure

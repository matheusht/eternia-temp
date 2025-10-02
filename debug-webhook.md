# Debugging CartPanda Webhook - Step by Step

## Setup

1. **Deploy the function** (if not already deployed):
   ```bash
   supabase functions deploy cartpanda-webhook
   ```

2. **Set your shop token** (if not already set):
   ```bash
   supabase secrets set CARTPANDA_SHOP_TOKEN="UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp"
   ```

## Debugging Session

### Open Two Terminals Side-by-Side

**Terminal 1 - Watch Logs:**
```bash
cd /home/caio/documents/freela/eternia-deliverable
supabase functions logs cartpanda-webhook --follow
```

**Terminal 2 - Send Test Request:**
```bash
cd /home/caio/documents/freela/eternia-deliverable
./test-webhook.sh
```

### What You Should See

**In Terminal 1 (Logs):**
```
2025-10-02 10:30:15 [INFO] === Incoming webhook request ===
2025-10-02 10:30:15 [INFO] Method: POST
2025-10-02 10:30:15 [INFO] Headers: {
  "content-type": "application/json",
  "x-shop-token": "UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp"
}
2025-10-02 10:30:15 [INFO] Token validation: {
  hasToken: true,
  hasExpectedToken: true,
  tokensMatch: true
}
2025-10-02 10:30:15 [INFO] Received CartPanda webhook: purchase.completed
2025-10-02 10:30:15 [INFO] Full payload: {
  "event": "purchase.completed",
  "data": {
    "order": {
      "customer": {
        "email": "test-1696244415@example.com"
      }
    }
  }
}
2025-10-02 10:30:15 [INFO] Email found in: data.order.customer.email
2025-10-02 10:30:15 [INFO] Creating user for email: test-1696244415@example.com
2025-10-02 10:30:16 [INFO] User created successfully: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**In Terminal 2 (Test Script Output):**
```
Testing webhook with email: test-1696244415@example.com
---
{"success":true,"user_id":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"test-1696244415@example.com","message":"User created successfully from CartPanda purchase"}

HTTP Status: 200
---
Check your Supabase dashboard to see if user was created with email: test-1696244415@example.com
```

## Common Issues & Solutions

### Issue: No Logs Appear

**Symptoms:**
- Terminal shows nothing when you test
- No output at all

**Solutions:**
```bash
# Check if function is deployed
supabase functions list

# Redeploy if needed
supabase functions deploy cartpanda-webhook

# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref ksxqdqycevtbmwetjtwt
```

### Issue: 401 Unauthorized

**Symptoms:**
```
[ERROR] Invalid shop token
Response: {"error":"Unauthorized"}
HTTP Status: 401
```

**Solutions:**
```bash
# Check if secret is set
supabase secrets list

# Set the token
supabase secrets set CARTPANDA_SHOP_TOKEN="UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp"

# Redeploy after setting secrets
supabase functions deploy cartpanda-webhook
```

### Issue: 400 No Email Found

**Symptoms:**
```
[ERROR] No email found in webhook payload
Response: {"error":"No customer email found in payload"}
HTTP Status: 400
```

**Solutions:**
1. Check the "Full payload" log entry - it shows the actual structure CartPanda sends
2. Look at where the email is located in the payload
3. If it's in a different location, we need to update the code

### Issue: User Already Exists

**Symptoms:**
```
[INFO] User already exists: test@example.com
Response: {"success":true,"message":"User already exists","email":"test@example.com"}
HTTP Status: 200
```

**This is normal!** The webhook handles this gracefully. For testing with new users each time, use `./test-webhook.sh` which generates unique emails.

## Filter Logs

**Show only errors:**
```bash
supabase functions logs cartpanda-webhook | grep -i error
```

**Show only last hour:**
```bash
supabase functions logs cartpanda-webhook --since "1 hour ago"
```

**Show logs from specific time:**
```bash
supabase functions logs cartpanda-webhook --since "2025-10-02T10:00:00Z"
```

## Verify User Creation

After seeing successful logs, verify in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt
2. Click: **Authentication** → **Users**
3. Look for the email from the logs
4. Check that:
   - ✅ User exists
   - ✅ Email is confirmed (green check)
   - ✅ Created timestamp matches your test time

## Production Testing

Once local testing works, test with real CartPanda webhooks:

1. **Keep logs running:**
   ```bash
   supabase functions logs cartpanda-webhook --follow
   ```

2. **Configure CartPanda webhook** (see main README)

3. **Make a test purchase** in your CartPanda shop (or use their test button)

4. **Watch the logs** - you should see the real payload structure from CartPanda

5. **If the payload structure is different:**
   - Copy the "Full payload" from logs
   - Update the email extraction logic in the code
   - Redeploy

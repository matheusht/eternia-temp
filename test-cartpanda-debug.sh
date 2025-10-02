#!/bin/bash

echo "========================================="
echo "🔍 Testing CartPanda Debug Webhook"
echo "========================================="
echo ""

WEBHOOK_URL="https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-debug"

echo "Sending test request to debug webhook..."
echo "URL: $WEBHOOK_URL"
echo ""

curl -X POST "$WEBHOOK_URL" \
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
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "========================================="
echo "📊 NOW CHECK THE LOGS!"
echo "========================================="
echo ""
echo "The webhook logged everything it received."
echo "View the detailed logs here:"
echo ""
echo "https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-debug/logs"
echo ""
echo "You'll see:"
echo "  ✅ All headers CartPanda sent"
echo "  ✅ The complete raw body"
echo "  ✅ The parsed JSON structure"
echo ""
echo "========================================="
echo ""
echo "💡 NEXT STEPS:"
echo "1. Open the logs URL above"
echo "2. Configure CartPanda webhook to use this URL:"
echo "   $WEBHOOK_URL"
echo "3. Make a test purchase in CartPanda"
echo "4. Check the logs to see the REAL payload structure"
echo ""

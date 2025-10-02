#!/bin/bash

echo "========================================="
echo "CartPanda Webhook - Debug & Test"
echo "========================================="
echo ""

echo "✅ Function deployed at:"
echo "   https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook"
echo ""

echo "📊 View logs in your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook/logs"
echo ""

echo "========================================="
echo "🧪 Testing webhook now..."
echo "========================================="
echo ""

TEST_EMAIL="test-$(date +%s)@example.com"
echo "Sending test purchase with email: $TEST_EMAIL"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST \
  "https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook" \
  -H "Content-Type: application/json" \
  -H "x-shop-token: UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp" \
  -d "{
    \"event\": \"purchase.completed\",
    \"data\": {
      \"order\": {
        \"customer\": {
          \"email\": \"$TEST_EMAIL\"
        }
      }
    }
  }")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""
echo "HTTP Status: $HTTP_STATUS"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ SUCCESS! User created."
    echo ""
    echo "Next steps:"
    echo "1. Check logs: https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook/logs"
    echo "2. Verify user: https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/auth/users"
    echo "3. Test email: $TEST_EMAIL"
else
    echo "❌ ERROR! Check the dashboard logs for details."
    echo "   https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook/logs"
fi

echo ""

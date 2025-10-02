#!/bin/bash

# Test CartPanda webhook locally or remotely

WEBHOOK_URL="https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook"
SHOP_TOKEN="UaqGx94ftZKBjMY6kyO8TgA9gvJwZ92ZC051cBTLpppOSkmO1jV8hwBFsfxp"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "Testing webhook with email: $TEST_EMAIL"
echo "---"

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-shop-token: $SHOP_TOKEN" \
  -d "{
    \"event\": \"purchase.completed\",
    \"data\": {
      \"order\": {
        \"customer\": {
          \"email\": \"$TEST_EMAIL\"
        }
      }
    }
  }" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo "---"
echo "Check your Supabase dashboard to see if user was created with email: $TEST_EMAIL"

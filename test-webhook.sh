#!/bin/bash

# Test CartPanda webhook locally or remotely

WEBHOOK_URL="https://ksxqdqycevtbmwetjtwt.supabase.co/functions/v1/cartpanda-webhook"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "Testing webhook with email: $TEST_EMAIL"
echo "---"

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"event\": \"order.fulfilled\",
    \"order\": {
      \"id\": 12345,
      \"email\": \"$TEST_EMAIL\",
      \"customer\": {
        \"email\": \"$TEST_EMAIL\",
        \"first_name\": \"Test\",
        \"last_name\": \"User\"
      }
    }
  }" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo "---"
echo "Check your Supabase dashboard to see if user was created with email: $TEST_EMAIL"

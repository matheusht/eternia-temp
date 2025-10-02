#!/bin/bash

echo "========================================="
echo "📊 CartPanda Webhook Logs"
echo "========================================="
echo ""
echo "Your Supabase CLI doesn't support the 'logs' command."
echo "You need to view logs in the Supabase Dashboard."
echo ""
echo "Opening logs in your browser..."
echo ""

LOGS_URL="https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook/logs"

if command -v xdg-open > /dev/null; then
    xdg-open "$LOGS_URL" 2>/dev/null &
elif command -v open > /dev/null; then
    open "$LOGS_URL" 2>/dev/null &
elif command -v wslview > /dev/null; then
    wslview "$LOGS_URL" 2>/dev/null &
else
    echo "⚠️  Could not auto-open browser."
fi

echo "📊 Function Logs:"
echo "   $LOGS_URL"
echo ""
echo "👥 View Users Created:"
echo "   https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/auth/users"
echo ""
echo "⚙️  Function Settings:"
echo "   https://supabase.com/dashboard/project/ksxqdqycevtbmwetjtwt/functions/cartpanda-webhook"
echo ""
echo "========================================="
echo "What you'll see in the logs:"
echo "========================================="
echo ""
echo "✅ Incoming webhook requests with headers"
echo "✅ Token validation status"
echo "✅ Full CartPanda payload structure"
echo "✅ Email extraction (which field it found)"
echo "✅ User creation success/errors"
echo "✅ Timestamps for each request"
echo ""
echo "💡 TIP: Keep the logs page open while testing"
echo "   to see requests appear in real-time!"
echo ""


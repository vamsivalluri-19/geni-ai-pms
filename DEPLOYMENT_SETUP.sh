#!/bin/bash

# Deployment Preparation Script
# This script helps prepare the project for deployment to Vercel and Render

echo "🚀 Deployment Preparation Script"
echo "=================================="
echo ""

# Check if files exist
echo "✓ Checking deployment configuration files..."

if [ ! -f "backend/render.yaml" ]; then
  echo "❌ Missing: backend/render.yaml"
else
  echo "✓ backend/render.yaml exists"
fi

if [ ! -f "frontend/vercel.json" ]; then
  echo "❌ Missing: frontend/vercel.json"
else
  echo "✓ frontend/vercel.json exists"
fi

if [ ! -f "backend/.env.example" ]; then
  echo "❌ Missing: backend/.env.example"
else
  echo "✓ backend/.env.example exists"
fi

if [ ! -f "frontend/.env.example" ]; then
  echo "❌ Missing: frontend/.env.example"
else
  echo "✓ frontend/.env.example exists"
fi

if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
  echo "❌ Missing: DEPLOYMENT_GUIDE.md"
else
  echo "✓ DEPLOYMENT_GUIDE.md exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Set up backend on Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Set environment variables from backend/.env.example"
echo "   - Note your backend URL"
echo ""
echo "2. Set up frontend on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Create new project"
echo "   - Set VITE_API_URL and VITE_BACKEND_URL"
echo "   - Deploy"
echo ""
echo "3. Update CORS in backend:"
echo "   - Set FRONTEND_URL to your Vercel app URL"
echo ""
echo "✅ Ready to deploy!"

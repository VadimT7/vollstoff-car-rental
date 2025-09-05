#!/bin/bash
set -e

echo "🚀 Starting Valore Rental deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file with production values"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Function to check if command was successful
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# 1. Build Docker images
echo "📦 Building Docker images..."
docker build -f infra/docker/Dockerfile.web -t valore-web:latest .
check_status "Web app image built"

docker build -f infra/docker/Dockerfile.admin -t valore-admin:latest .
check_status "Admin app image built"

docker build -f infra/docker/Dockerfile.migrate -t valore-migrate:latest .
check_status "Migration image built"

# 2. Run database migrations
echo -e "\n🗄️  Running database migrations..."
docker run --rm \
    -e DATABASE_URL="$DATABASE_URL" \
    valore-migrate:latest
check_status "Database migrations completed"

# 3. Tag images for registry
if [ -n "$DOCKER_REGISTRY" ]; then
    echo -e "\n🏷️  Tagging images for registry..."
    docker tag valore-web:latest ${DOCKER_REGISTRY}/valore-web:latest
    docker tag valore-admin:latest ${DOCKER_REGISTRY}/valore-admin:latest
    check_status "Images tagged"
    
    # 4. Push to registry
    echo -e "\n⬆️  Pushing images to registry..."
    docker push ${DOCKER_REGISTRY}/valore-web:latest
    check_status "Web image pushed"
    
    docker push ${DOCKER_REGISTRY}/valore-admin:latest
    check_status "Admin image pushed"
fi

# 5. Deploy to Vercel (if using Vercel)
if command -v vercel &> /dev/null; then
    echo -e "\n🔺 Deploying to Vercel..."
    cd apps/web
    vercel --prod --yes
    check_status "Web app deployed to Vercel"
    
    cd ../admin
    vercel --prod --yes
    check_status "Admin app deployed to Vercel"
    cd ../..
fi

# 6. Update Sanity Studio (if changes)
if [ -d "apps/sanity" ]; then
    echo -e "\n📝 Deploying Sanity Studio..."
    cd apps/sanity
    npm run deploy
    check_status "Sanity Studio deployed"
    cd ../..
fi

# 7. Invalidate CDN cache (if using Cloudflare)
if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "\n🌐 Invalidating CDN cache..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}' \
        --silent > /dev/null
    check_status "CDN cache invalidated"
fi

# 8. Health checks
echo -e "\n❤️  Running health checks..."
sleep 5

# Check web app
if curl -f -s -o /dev/null "${NEXT_PUBLIC_APP_URL}/api/health"; then
    echo -e "${GREEN}✓ Web app is healthy${NC}"
else
    echo -e "${RED}✗ Web app health check failed${NC}"
fi

# Check admin app
if curl -f -s -o /dev/null "${ADMIN_URL}/api/health"; then
    echo -e "${GREEN}✓ Admin app is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Admin app health check failed (may not be critical)${NC}"
fi

# 9. Send deployment notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    echo -e "\n📢 Sending deployment notification..."
    curl -X POST $SLACK_WEBHOOK_URL \
        -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Valore Rental deployed successfully!\"}" \
        --silent > /dev/null
    check_status "Notification sent"
fi

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "🌐 Web app: ${NEXT_PUBLIC_APP_URL}"
echo -e "🔧 Admin app: ${ADMIN_URL}"

# Optional: Show recent logs
echo -e "\n📋 Recent deployment logs:"
if command -v vercel &> /dev/null; then
    vercel logs --since 5m -n 20
fi

# Use official Node image
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
# We use skip-lint to ensure build doesn't fail on linting during Docker build if not desired
RUN npm run build

# Production image
FROM node:22-slim AS runner

WORKDIR /app

# Copy built files and node_modules from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

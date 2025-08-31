# Stage 1: Build the application (for production)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production / Development image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Use NODE_ENV to choose between dev and prod
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]

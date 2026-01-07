# Use official Node LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript (keeps source maps)
RUN npm run build

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose app port
EXPOSE 3000

# Run compiled app
CMD ["node", "dist/server.js"]

FROM node:20-alpine

WORKDIR /app

# Copy manifests
COPY package*.json tsconfig.json ./

# Install ALL deps (needed for build)
RUN npm ci

# Copy source
COPY src ./src

# Build TypeScript
RUN npm run build

# Remove devDependencies AFTER build
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/server.js"]

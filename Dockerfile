FROM node:20-bookworm-slim AS base
WORKDIR /app

# System Chromium + zip (avoids Playwright's ~100MB browser download)
RUN apt-get update && apt-get install -y \
  zip chromium \
  && rm -rf /var/lib/apt/lists/*

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]

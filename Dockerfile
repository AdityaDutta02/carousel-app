FROM node:20-bookworm-slim AS base
WORKDIR /app

# System deps for Playwright Chromium + zip
RUN apt-get update && apt-get install -y \
  zip \
  libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 \
  libcairo2 libx11-6 libx11-xcb1 libxcb1 libxext6 libexpat1 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

# Install Playwright Chromium browser
RUN npx playwright install chromium

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]

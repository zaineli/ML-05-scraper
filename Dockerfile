# Base image with Node.js
FROM node:18-slim

# Set environment variable to indicate Puppeteer runs in Docker
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create app directory and copy the package.json
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies (Puppeteer included)
RUN npm install

# Copy the application code
COPY . .

# Verify that Chromium is installed
RUN which chromium-browser || echo "Chromium not found"

# Expose any necessary ports (if needed)
EXPOSE 3000

# Command to run the Puppeteer script (replace index.js with your script)
CMD ["node", "index.js"]

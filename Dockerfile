FROM node:18

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    ca-certificates \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variable agar Puppeteer tidak sandbox error
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Buat folder kerja
WORKDIR /app

# Salin file proyek
COPY . .

# Install puppeteer agar punya API lengkap (tanpa download Chromium)
RUN npm install puppeteer

RUN npm run build

EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]

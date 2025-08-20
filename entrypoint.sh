#!/bin/bash

echo "🚀 [Entrypoint] Inisialisasi container..."

ls -al /app/.wwebjs_auth/ | grep -v "Singleton" || true
# Contoh: bersihkan lock Chromium (WA / Puppeteer)
rm -f /app/.wwebjs_auth/session/Singleton*

# Bisa tambahkan inisialisasi lain di sini
# misal: cek env, buat folder, dsb

echo "✅ [Entrypoint] Menjalankan perintah utama: $@"
exec "$@"

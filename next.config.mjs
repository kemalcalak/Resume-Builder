/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// Çevresel değişkenleri yükler
dotenv.config();

const nextConfig = {
  reactStrictMode: true, // Next.js özelliklerini etkinleştirir
  env: {
    CUSTOM_VARIABLE: process.env.CUSTOM_VARIABLE, // Değişkeni Next.js'e aktarır
  },
};

export default nextConfig;

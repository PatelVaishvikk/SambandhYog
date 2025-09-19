/** @type {import('next').NextConfig} */
const allowedDevOrigins = (() => {
  const envOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS ?? process.env.ALLOWED_DEV_ORIGINS;
  const origins = envOrigins ? envOrigins.split(',').map((origin) => origin.trim()).filter(Boolean) : [];

  if (process.env.TUNNEL_URL) {
    origins.push(process.env.TUNNEL_URL);
  }

  return [...new Set(origins.filter(Boolean))];
})();

const nextConfig = {
  ...(allowedDevOrigins.length ? { allowedDevOrigins } : {}),
};

export default nextConfig;

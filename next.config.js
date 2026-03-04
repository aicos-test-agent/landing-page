const nextConfig = {
  // Cloudflare Pages with Next.js preset
  // trailingSlash must be false for API routes to work on Cloudflare Pages
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

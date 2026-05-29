export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://shotlist.uk/sitemap.xml",
  };
}
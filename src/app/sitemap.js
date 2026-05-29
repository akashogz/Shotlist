export default function sitemap() {
  return [
    {
      url: "https://shotlist.uk",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://shotlist.uk/browse",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://shotlist.uk/login",
      lastModified: new Date(),
      priority: 0.3,
    },
    {
      url: "https://shotlist.uk/signup",
      lastModified: new Date(),
      priority: 0.3,
    },
  ];
}
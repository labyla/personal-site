export type TestimonialSeedItem = {
  slug: string
  name: string
  role: string
  quote: string
  avatarUrl: string
  rating: number
  featured: boolean
  sortOrder: number
  status: "published"
}

export const testimonialSeedItems: TestimonialSeedItem[] = [
  {
    slug: "marcus-t",
    name: "Marcus T.",
    role: "Startup Founder",
    quote: "I've shipped 6 projects together with Aayush. He's excellent at balancing design and development.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    featured: true,
    sortOrder: 0,
    status: "published",
  },
  {
    slug: "maria-cross",
    name: "Maria Cross",
    role: "Product Manager",
    quote: "Took Cross Figma to production quickly. Great communication throughout the project.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    featured: false,
    sortOrder: 10,
    status: "published",
  },
  {
    slug: "jordan-k",
    name: "Jordan K.",
    role: "Tech Lead",
    quote: "Finally a developer who actually understands design and can ship clean, maintainable code.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    featured: false,
    sortOrder: 20,
    status: "published",
  },
]

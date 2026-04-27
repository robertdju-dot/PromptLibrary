export type Role = "USER" | "ADMIN";
export type Tier = "FREE" | "PREMIUM";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tier: Tier;
  status: "ACTIVE" | "BANNED";
}

export interface Tag {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  isPublic: boolean;
  isMemberOnly?: boolean;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
}

export const mockUsers: User[] = [
  {
    id: "user_1",
    email: "john@example.com",
    name: "John Doe",
    role: "USER",
    tier: "FREE",
    status: "ACTIVE",
  },
  {
    id: "user_2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "ADMIN",
    tier: "PREMIUM",
    status: "ACTIVE",
  },
];

export const mockTags: Tag[] = [
  { id: "tag_1", name: "Marketing" },
  { id: "tag_2", name: "Sales" },
  { id: "tag_3", name: "Engineering" },
  { id: "tag_4", name: "SEO" },
];

export const mockPrompts: Prompt[] = [
  {
    id: "prompt_1",
    userId: "user_1",
    title: "Cold Email Outreach",
    description: "A highly converting cold email template for B2B sales.",
    content: "Write a cold email to #target_role# at #company_name# offering our #product_or_service#. Keep it under 150 words and focus on the pain point of #pain_point#.",
    isPublic: true,
    createdAt: "2024-05-01T10:00:00Z",
    tags: [mockTags[1]],
  },
  {
    id: "prompt_2",
    userId: "user_1",
    title: "Blog Post Outline",
    description: "Generate a comprehensive outline for an SEO-optimized blog post.",
    content: "Act as an expert content marketer. Create a blog post outline for the topic: '#topic#'. The target audience is #audience#. Include at least 5 headings (H2) and suggest keywords for each section.",
    isPublic: false,
    createdAt: "2024-05-02T11:30:00Z",
    tags: [mockTags[0], mockTags[3]],
  },
  {
    id: "prompt_3",
    userId: "user_2",
    title: "Code Review Assistant",
    description: "Prompt to act as a senior engineer reviewing code.",
    content: "Review the following #language# code. Point out any security vulnerabilities, performance bottlenecks, and deviations from best practices. Finally, suggest a refactored version.\n\nCode:\n#code_snippet#",
    isPublic: true,
    createdAt: "2024-05-03T09:15:00Z",
    tags: [mockTags[2]],
  },
];

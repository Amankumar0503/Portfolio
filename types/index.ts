// Database entity types

export interface About {
  id: string;
  title: string;
  description: string;
  profile_image_url?: string;
  resume_url?: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  project_pdf_url?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  location?: string;
  display_order: number;
  created_at: string;
  type?: "experience" | "education" | "milestone";
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  is_visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

// Form data types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SkillFormData {
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  display_order: number;
}

export interface ProjectFormData {
  title: string;
  short_description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  project_pdf_url?: string;
  is_featured: boolean;
  display_order: number;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  display_order: number;
}

export interface SocialLinkFormData {
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  is_visible: boolean;
}

export interface AboutFormData {
  title: string;
  description: string;
  profile_image_url?: string;
  resume_url?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProjects: number;
  featuredProjects: number;
  totalSkills: number;
  totalExperiences: number;
  unreadMessages: number;
  totalMessages: number;
}

// Upload response
export interface UploadResponse {
  url: string;
  path: string;
}

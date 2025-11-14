import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Cloud,
  Code2,
  Cpu,
  FlaskConical,
  Gauge,
  GraduationCap,
  Headphones,
  Home,
  Leaf,
  LifeBuoy,
  LineChart,
  Mail,
  Package,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Layers,
  Globe,
} from "lucide-react";

export type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: MenuItem[];
};

// humnize comet anchor: this menu catalog powers the layered drawer structure.
export const menuCatalog: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    subtitle: "Welcome to our comprehensive platform",
    icon: Home,
  },
  {
    id: "products",
    title: "Products & Services",
    subtitle: "Explore our comprehensive offerings",
    icon: Package,
    children: [
      {
        id: "software",
        title: "Software Solutions",
        subtitle: "Custom software development and deployment",
        icon: Code2,
      },
      {
        id: "cloud",
        title: "Cloud & Infrastructure",
        subtitle: "Scalable cloud solutions and infrastructure",
        icon: Cloud,
        children: [
          {
            id: "architecture",
            title: "System Architecture",
            subtitle: "Scalable system design and planning",
            icon: Layers,
          },
          {
            id: "performance",
            title: "Performance Optimization",
            subtitle: "Application and system optimization",
            icon: Gauge,
          },
          {
            id: "security",
            title: "Security Audits",
            subtitle: "Comprehensive security assessments",
            icon: ShieldCheck,
          },
        ],
      },
      {
        id: "consulting",
        title: "Consulting Services",
        subtitle: "Expert guidance and strategic support",
        icon: BriefcaseBusiness,
        children: [
          {
            id: "technical",
            title: "Technical Consulting",
            subtitle: "Architecture and implementation guidance",
            icon: Cpu,
          },
          {
            id: "strategy",
            title: "Business Strategy",
            subtitle: "Digital transformation and planning",
            icon: TrendingUp,
          },
          {
            id: "training",
            title: "Training & Workshops",
            subtitle: "Team skill development and knowledge transfer",
            icon: GraduationCap,
          },
        ],
      },
      {
        id: "digital-transformation",
        title: "Digital Transformation",
        subtitle: "Comprehensive digital strategies",
        icon: Sparkles,
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity Consulting",
        subtitle: "Comprehensive protection services",
        icon: Shield,
      },
      {
        id: "analytics",
        title: "Data & Analytics",
        subtitle: "Data strategy, analytics, and intelligence",
        icon: BarChart3,
      },
      {
        id: "devops",
        title: "DevOps & Platform Engineering",
        subtitle: "Transformation and platform engineering",
        icon: Workflow,
      },
      {
        id: "support",
        title: "Support & Maintenance",
        subtitle: "Ongoing maintenance and support services",
        icon: LifeBuoy,
      },
    ],
  },
  {
    id: "company",
    title: "Company",
    subtitle: "Learn about our organization and culture",
    icon: Building2,
    children: [
      {
        id: "about",
        title: "About Us",
        subtitle: "Mission, vision, and leadership",
        icon: Globe,
      },
      {
        id: "careers",
        title: "Careers",
        subtitle: "Join our growing team",
        icon: Users,
      },
      {
        id: "investor",
        title: "Investor Relations",
        subtitle: "Financial information and updates",
        icon: LineChart,
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    subtitle: "Knowledge base, tools, and learning materials",
    icon: BookOpen,
    children: [
      {
        id: "support",
        title: "Support",
        subtitle: "Get help when you need it",
        icon: Headphones,
      },
      {
        id: "innovation",
        title: "Research & Innovation",
        subtitle: "Cutting-edge initiatives",
        icon: FlaskConical,
      },
      {
        id: "sustainability",
        title: "Sustainability",
        subtitle: "Environmental responsibility",
        icon: Leaf,
      },
      {
        id: "contact",
        title: "Contact",
        subtitle: "Get in touch with our team",
        icon: Mail,
      },
    ],
  },
];

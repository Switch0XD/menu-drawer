"use client";

import { useMemo, useState } from "react";

type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  children?: MenuItem[];
};

// humnize comet anchor: this menu catalog powers the layered drawer structure.
const menuCatalog: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    subtitle: "Welcome to our comprehensive platform",
    icon: "🏠",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        subtitle: "Your personalized overview",
        icon: "📊",
        children: [
          {
            id: "activity",
            title: "Activity Feed",
            subtitle: "Recent activities and updates",
            icon: "📰",
          },]
      }
    ]
  },
  {
    id: "products",
    title: "Products & Services",
    subtitle: "Explore our comprehensive offerings",
    icon: "🧩",
    children: [
      {
        id: "software",
        title: "Software Solutions",
        subtitle: "Custom software development and deployment",
        icon: "💻",
      },
      {
        id: "cloud",
        title: "Cloud & Infrastructure",
        subtitle: "Scalable cloud solutions and infrastructure",
        icon: "☁️",
        children: [
          {
            id: "architecture",
            title: "System Architecture",
            subtitle: "Scalable system design and planning",
            icon: "🗂️",
          },
          {
            id: "performance",
            title: "Performance Optimization",
            subtitle: "Application and system optimization",
            icon: "⚡",
          },
          {
            id: "security",
            title: "Security Audits",
            subtitle: "Comprehensive security assessments",
            icon: "🛡️",
          },
        ],
      },
      {
        id: "consulting",
        title: "Consulting Services",
        subtitle: "Expert guidance and strategic support",
        icon: "🧠",
        children: [
          {
            id: "technical",
            title: "Technical Consulting",
            subtitle: "Architecture and implementation guidance",
            icon: "💡",
          },
          {
            id: "strategy",
            title: "Business Strategy",
            subtitle: "Digital transformation and planning",
            icon: "📈",
          },
          {
            id: "training",
            title: "Training & Workshops",
            subtitle: "Team skill development and knowledge transfer",
            icon: "🎓",
          },
        ],
      },
      {
        id: "digital-transformation",
        title: "Digital Transformation",
        subtitle: "Comprehensive digital strategies",
        icon: "✨",
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity Consulting",
        subtitle: "Comprehensive protection services",
        icon: "🔐",
      },
      {
        id: "analytics",
        title: "Data & Analytics",
        subtitle: "Data strategy, analytics, and intelligence",
        icon: "📊",
      },
      {
        id: "devops",
        title: "DevOps & Platform Engineering",
        subtitle: "Transformation and platform engineering",
        icon: "⚙️",
      },
      {
        id: "support",
        title: "Support & Maintenance",
        subtitle: "Ongoing maintenance and support services",
        icon: "🧰",
      },
    ],
  },
  {
    id: "company",
    title: "Company",
    subtitle: "Learn about our organization and culture",
    icon: "🏢",
    children: [
      {
        id: "about",
        title: "About Us",
        subtitle: "Mission, vision, and leadership",
        icon: "🌍",
      },
      {
        id: "careers",
        title: "Careers",
        subtitle: "Join our growing team",
        icon: "🧑‍🚀",
      },
      {
        id: "investor",
        title: "Investor Relations",
        subtitle: "Financial information and updates",
        icon: "💹",
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    subtitle: "Knowledge base, tools, and learning materials",
    icon: "📚",
    children: [
      {
        id: "support",
        title: "Support",
        subtitle: "Get help when you need it",
        icon: "🆘",
      },
      {
        id: "innovation",
        title: "Research & Innovation",
        subtitle: "Cutting-edge initiatives",
        icon: "🔬",
      },
      {
        id: "sustainability",
        title: "Sustainability",
        subtitle: "Environmental responsibility",
        icon: "🌱",
      },
      {
        id: "contact",
        title: "Contact",
        subtitle: "Get in touch with our team",
        icon: "✉️",
      },
    ],
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<MenuItem[]>([]);
  const [selectedLeaf, setSelectedLeaf] = useState<MenuItem | null>(null);

  const currentItems = useMemo(() => {
    if (breadcrumbs.length === 0) return menuCatalog;
    const parent = breadcrumbs[breadcrumbs.length - 1];
    return parent.children ?? [];
  }, [breadcrumbs]);

  const headerTitle =
    breadcrumbs.length === 0
      ? "Browse our menu"
      : breadcrumbs[breadcrumbs.length - 1].title;

  const headerSubtitle =
    breadcrumbs.length === 0
      ? "Tap an item to dive deeper. Swipe down or hit close to dismiss."
      : breadcrumbs[breadcrumbs.length - 1].subtitle;

  const handleDrawerClose = () => {
    setIsOpen(false);
    setBreadcrumbs([]);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children?.length) {
      setBreadcrumbs((prev) => [...prev, item]);
      setSelectedLeaf(null);
      return;
    }
    setSelectedLeaf(item);
  };

  const handleBack = () => {
    if (breadcrumbs.length === 0) return;
    setBreadcrumbs((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-100 p-6 text-zinc-900">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Mobile drawer demo
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-900">
          Nested bottom sheet
        </h1>
        <p className="mt-2 max-w-md text-base text-zinc-600">
          Launch the sheet to explore a multi-level navigation pattern.
        </p>
      </div>

      <button
        className="rounded-full bg-blue-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        onClick={() => {
          setIsOpen(true);
          setBreadcrumbs([]);
        }}
      >
        Open Menu
      </button>

      {selectedLeaf && (
        <p className="text-sm text-zinc-600">
          Last selection:{" "}
          <span className="font-semibold text-zinc-900">{selectedLeaf.title}</span>
        </p>
      )}

      <div
        className={`fixed inset-0 z-40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleDrawerClose}
          aria-hidden="true"
        />

        <div
          className={`absolute inset-x-0 bottom-0 flex justify-center px-4 pb-6 transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                {breadcrumbs.length > 0 ? (
                  <button
                    className="mb-2 flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    onClick={handleBack}
                  >
                    <span className="text-lg">←</span> Back
                  </button>
                ) : (
                  <span className="text-sm font-medium uppercase tracking-wide text-zinc-400">
                    Menu
                  </span>
                )}
                <h2 className="text-2xl font-semibold text-zinc-900">
                  {headerTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">{headerSubtitle}</p>
              </div>
              <button
                className="rounded-full border border-zinc-200 p-2 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
                aria-label="Close drawer"
                onClick={handleDrawerClose}
              >
                ✕
              </button>
            </div>

            <ul className="mt-4 divide-y divide-zinc-100">
              {currentItems.map((item) => (
                <li key={item.id}>
                  <button
                    className="flex w-full items-center gap-4 py-4 text-left"
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-2xl">
                      {item.icon}
                    </span>
                    <span className="flex-1">
                      <p className="text-base font-semibold text-zinc-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-zinc-500">{item.subtitle}</p>
                    </span>
                    {item.children && (
                      <span className="text-2xl text-zinc-300">›</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

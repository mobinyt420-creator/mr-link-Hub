import React from "react";
import {
  Zap,
  Send,
  MessageCircle,
  Radio,
  Server,
  Download,
  Flame,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Video,
  ShoppingBag,
  CreditCard,
  Globe,
  Star,
  Terminal,
  Wifi,
  Code,
  FileText,
  Smartphone,
  Laptop,
  Headphones,
  Gift,
  Compass,
  Share2,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Trash2,
  Edit3,
  Plus,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Settings,
  Layers,
  BarChart3,
  Link,
  File,
  AlertCircle,
  Info,
  Search,
  MoveVertical,
  GripVertical,
  Play,
  LucideProps,
} from "lucide-react";

// 1. Official Telegram Logo (Authentic circular Telegram blue with white airplane)
export const TelegramLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="120" cy="120" r="120" fill="url(#tg_grad)" />
    <path
      d="M50.4 116.8l38.2 14.3 14.8 45.4c1.1 3.4 4.5 5.5 8 4.7 3.5-.8 20.6-17.1 20.6-17.1l36.5 27c3.8 2.8 9.1 1.7 11.4-2.4l34.8-124.6c1.2-4.4-2.5-8.5-6.9-7.5L50.4 105.7c-4.4 1.1-4.4 7.4 0 11.1zm49 14.4l65.8-41.2c1.4-.9 2.8 1.1 1.6 2.2l-54.7 49.3c-2.3 2.1-3.8 5-4.2 8.1l-1.8 16.5-9.2-30.8c-.4-1.6.3-3.3 1.8-4.1z"
      fill="#FFFFFF"
    />
    <defs>
      <linearGradient id="tg_grad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2AABEE" />
        <stop offset="1" stopColor="#229ED9" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Official YouTube Logo (Authentic Red pill with white play triangle)
export const YoutubeLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M250.2 28.1C247.3 17 238.6 8.3 227.5 5.4 207.5 0 128 0 128 0S48.5 0 28.5 5.4C17.4 8.3 8.7 17 5.8 28.1 0 48.2 0 90 0 90s0 41.8 5.8 61.9c2.9 11.1 11.6 19.8 22.7 22.7 20 5.4 99.5 5.4 99.5 5.4s79.5 0 99.5-5.4c11.1-2.9 19.8-11.6 22.7-22.7 5.8-20.1 5.8-61.9 5.8-61.9s0-41.8-5.8-61.9z"
      fill="#FF0000"
    />
    <path d="M102.4 128.4L169 90l-66.6-38.4v76.8z" fill="#FFFFFF" />
  </svg>
);

// 3. Official WhatsApp Logo (Authentic Green with white phone bubble)
export const WhatsAppLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="120" cy="120" r="120" fill="#25D366" />
    <path
      d="M175.2 143.8c-3-1.5-17.8-8.8-20.6-9.8-2.8-1-4.8-1.5-6.8 1.5s-7.8 9.8-9.5 11.8c-1.8 2-3.5 2.3-6.5.8-3-1.5-12.7-4.7-24.2-15-9-8-15-17.9-16.8-20.9-1.8-3-.2-4.6 1.3-6.1 1.4-1.4 3-3.5 4.5-5.3 1.5-1.8 2-3 3-5 .1-2 .1-3.8-.7-5.3s-6.8-16.3-9.3-22.4c-2.4-5.9-4.9-5.1-6.8-5.2l-5.8-.1c-2 0-5.3.8-8 3.8s-10.5 10.3-10.5 25.1c0 14.8 10.8 29.1 12.3 31.1 1.5 2 21.2 32.4 51.5 45.5 7.2 3.1 12.8 5 17.2 6.4 7.2 2.3 13.8 2 19 .1 5.8-.9 17.8-7.3 20.3-14.3 2.5-7 2.5-13.1 1.8-14.3-.8-1.2-2.8-2-5.8-3.5z"
      fill="#FFFFFF"
    />
  </svg>
);

// 4. Official Facebook Logo
export const FacebookLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="120" cy="120" r="120" fill="#1877F2" />
    <path
      d="M136.5 176v-53.5h18l2.7-21h-20.7v-13.4c0-6.1 1.7-10.2 10.4-10.2h11.1V58.2c-1.9-.3-8.5-.8-16.1-.8-15.9 0-26.8 9.7-26.8 27.6v15.5H97v21h18.1V176h21.4z"
      fill="#FFFFFF"
    />
  </svg>
);

// 5. Official Free Fire / Diamond Logo
export const DiamondLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 3L2 9L12 21L22 9L18 3H6Z"
      fill="url(#diamond_grad)"
      stroke="#60A5FA"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M2 9H22M12 21L7.5 9L10 3M12 21L16.5 9L14 3"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.8"
    />
    <defs>
      <linearGradient id="diamond_grad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Official TikTok Logo
export const TikTokLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="120" cy="120" r="120" fill="#010101" />
    <path
      d="M165.5 99.5c-8.2-5.3-14-14-15.2-24h-24.8v85.2c0 13.2-10.7 23.8-23.8 23.8-5.1 0-9.9-1.6-13.8-4.4-6.4-4.5-10.5-12-10.5-20.4 0-13.2 10.7-23.8 23.8-23.8 2.5 0 4.9.4 7.1 1.1v-25.4c-2.3-.3-4.7-.5-7.1-.5-27 0-48.9 21.9-48.9 48.9 0 16.7 8.4 31.5 21.2 40.3 8 5.5 17.7 8.6 28.1 8.6 27 0 48.9-21.9 48.9-48.9v-44.8c10.2 7.3 22.6 11.6 36 11.6v-24.8c-7.5 0-14.5-2.2-20.5-5.8"
      fill="#25F4EE"
    />
    <path
      d="M171.5 105.3c-8.2-5.3-14-14-15.2-24h-24.8v85.2c0 13.2-10.7 23.8-23.8 23.8-5.1 0-9.9-1.6-13.8-4.4 5.6 5.8 13.4 9.4 22 9.4 13.2 0 23.8-10.7 23.8-23.8V86h24.8c1.2 10 7 18.7 15.2 24 6 3.6 13 5.8 20.5 5.8v-7.2c-7.5-.5-14.5-2.6-20.5-6"
      fill="#FE2C55"
    />
  </svg>
);

// 7. Official Instagram Logo
export const InstagramLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="ig_grad" x1="40" y1="220" x2="220" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFDC80" />
        <stop offset="0.3" stopColor="#F77737" />
        <stop offset="0.6" stopColor="#E1306C" />
        <stop offset="1" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect width="240" height="240" rx="56" fill="url(#ig_grad)" />
    <rect x="42" y="42" width="156" height="156" rx="36" stroke="#FFFFFF" strokeWidth="14" fill="none" />
    <circle cx="120" cy="120" r="38" stroke="#FFFFFF" strokeWidth="14" fill="none" />
    <circle cx="174" cy="66" r="11" fill="#FFFFFF" />
  </svg>
);

export const ICON_MAP: Record<string, React.FC<any>> = {
  Zap,
  Youtube: YoutubeLogo,
  YouTube: YoutubeLogo,
  Telegram: TelegramLogo,
  Send: TelegramLogo,
  WhatsApp: WhatsAppLogo,
  MessageCircle: WhatsAppLogo,
  Facebook: FacebookLogo,
  TikTok: TikTokLogo,
  Instagram: InstagramLogo,
  Diamond: DiamondLogo,
  Radio,
  Server,
  Download,
  Flame,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  Video,
  Play,
  ShoppingBag,
  CreditCard,
  Globe,
  Star,
  Terminal,
  Wifi,
  Code,
  FileText,
  Smartphone,
  Laptop,
  Headphones,
  Gift,
  Compass,
  Share2,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Trash2,
  Edit3,
  Plus,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Settings,
  Layers,
  BarChart3,
  Link,
  File,
  AlertCircle,
  Info,
  Search,
  MoveVertical,
  GripVertical,
};

export const AVAILABLE_ICONS = [
  // Official Brands
  { name: "Telegram", label: "Telegram (Official)", category: "Social" },
  { name: "Youtube", label: "YouTube (Official)", category: "Social" },
  { name: "WhatsApp", label: "WhatsApp (Official)", category: "Social" },
  { name: "Facebook", label: "Facebook (Official)", category: "Social" },
  { name: "TikTok", label: "TikTok (Official)", category: "Social" },
  { name: "Instagram", label: "Instagram (Official)", category: "Social" },
  { name: "Diamond", label: "Free Fire Diamond", category: "Gaming" },

  // General & Highlights
  { name: "Zap", label: "Instant / Lightning", category: "General" },
  { name: "Flame", label: "Hot / Trending", category: "General" },
  { name: "Sparkles", label: "VIP / Premium", category: "General" },
  { name: "Star", label: "Featured", category: "General" },
  { name: "ShieldCheck", label: "Verified / Secure", category: "General" },
  { name: "Globe", label: "Website / Web", category: "General" },
  { name: "ExternalLink", label: "External Link", category: "General" },

  // Tech & Gaming
  { name: "Server", label: "Proxy / Server", category: "Tech" },
  { name: "Gamepad2", label: "Gaming / Free Fire", category: "Tech" },
  { name: "Download", label: "Download / APK", category: "Tech" },
  { name: "Terminal", label: "Terminal / Config", category: "Tech" },
  { name: "Wifi", label: "Network / WiFi", category: "Tech" },
  { name: "Code", label: "Development", category: "Tech" },
  { name: "Smartphone", label: "Mobile App", category: "Tech" },
  { name: "Laptop", label: "Desktop App", category: "Tech" },

  // Media & Commerce
  { name: "Video", label: "Video / Tutorial", category: "Media" },
  { name: "Play", label: "Play / Watch", category: "Media" },
  { name: "ShoppingBag", label: "Shop / Store", category: "Commerce" },
  { name: "CreditCard", label: "Payment / Top-up", category: "Commerce" },
  { name: "Gift", label: "Giveaway / Offer", category: "Commerce" },
];

export function DynamicIcon({
  name,
  className = "w-5 h-5",
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  if (!name) return <ExternalLink className={className} size={size} />;

  // Support for custom uploaded image / image URL:
  if (
    name.startsWith("http://") ||
    name.startsWith("https://") ||
    name.startsWith("data:image/") ||
    name.startsWith("/")
  ) {
    return (
      <img
        src={name}
        alt="logo"
        className={`${className} object-contain rounded-lg`}
        style={{ width: size, height: size }}
      />
    );
  }

  const IconComponent = ICON_MAP[name];
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  return <ExternalLink className={className} size={size} />;
}
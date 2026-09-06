"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AdminLanguage = "en" | "bn";

export const translations = {
  en: {
    // Navigation
    navDashboard: "Dashboard",
    navLinks: "Link Library",
    navPages: "Pages",
    navMainSite: "Main Website",
    navAnalytics: "Analytics",
    navSettings: "Settings",
    navCreatePage: "Create Extra Page",
    navViewHub: "View Main Hub",
    navSignOut: "Sign Out",
    navControlCenter: "Control Center",
    navProductionLive: "Production Live",
    navPublic: "Public",

    // Dashboard
    dashTitle: "Dashboard Overview",
    dashSubtitle: "Real-time analytics, pages, and link distribution",
    dashCreatePage: "Create Page",
    dashLinkLibrary: "Link Library",
    dashTotalViews: "Total Views",
    dashAcrossAll: "Across all pages",
    dashLinkClicks: "Link Clicks",
    dashOutboundTaps: "Outbound taps",
    dashAvgCtr: "Avg CTR",
    dashConversionRate: "Conversion efficiency",
    dashTotalPages: "Total Pages",
    dashActivePages: "active",
    dashTopPages: "Top Performing Pages",
    dashManageAll: "Manage All",
    dashComponentsCount: "components",
    dashViews: "views",
    dashClicks: "clicks",
    dashSessions: "sessions",
    dashTopLinks: "Top Clicked Destinations",
    dashViewLibrary: "View Library",
    dashUsedIn: "Used in",
    dashTrafficSources: "Traffic Sources & Referrers",
    dashVisitorDevices: "Visitor Devices",
    dashNoData: "No data tracked yet.",

    // Links Management
    linksTitle: "Reusable Link Library",
    linksSubtitle: "Manage your links, official badges, and destination URLs",
    linksAddNew: "Add New Link",
    linksSearchPlaceholder: "Search links by title or URL...",
    linksAllCategories: "All Categories",
    linksTotalCount: "Total Links",
    linksActiveStatus: "Active",
    linksInactiveStatus: "Inactive",
    linksEdit: "Edit",
    linksDelete: "Delete",
    linksClicks: "Clicks",
    linksCategory: "Category",
    linksBadge: "Badge",
    linksDestination: "Destination",
    linksModalAddTitle: "Add New Destination Link",
    linksModalEditTitle: "Edit Destination Link",
    linksFieldTitle: "Link Title",
    linksFieldUrl: "Target URL",
    linksFieldDesc: "Description / Subtitle",
    linksFieldIcon: "Select Icon / Brand",
    linksFieldType: "Component Type",
    linksFieldCategory: "Category",
    linksFieldBadge: "Highlight Badge",
    linksFieldStatus: "Active Status",
    linksBtnSave: "Save Link",
    linksBtnCancel: "Cancel",

    // Settings
    settingsTitle: "Brand & Platform Settings",
    settingsSubtitle: "Customize your personal identity, bio, theme colors, and security",
    settingsSaveSuccess: "Settings saved successfully!",
    settingsBrandIdentity: "Brand Identity",
    settingsBrandName: "Brand / Display Name",
    settingsUsername: "Username / Handle",
    settingsBio: "Bio Description",
    settingsAvatarUrl: "Avatar Image URL",
    settingsAccentColor: "Accent Theme Color",
    settingsAnnouncement: "Announcement Banner",
    settingsAnnouncementToggle: "Display announcement banner at top of site",
    settingsAnnouncementText: "Banner Message",
    settingsAnnouncementUrl: "Banner Click URL (Optional)",
    settingsSeoMetadata: "SEO & Social Sharing",
    settingsSeoTitle: "SEO Meta Title",
    settingsSeoDescription: "SEO Meta Description",
    settingsSecurity: "Admin Password & Security",
    settingsCurrentPass: "Current Password",
    settingsNewPass: "New Password",
    settingsBtnSave: "Save All Changes",

    // Pages Management
    pagesTitle: "Dynamic Pages & Slugs",
    pagesSubtitle: "Manage your main link hub and dynamic extra campaign pages",
    pagesCreateNew: "Create Extra Page",
    pagesMainSiteBadge: "MAIN HUB",
    pagesSlug: "Slug",
    pagesStatus: "Status",
    pagesActions: "Actions",

    // Common
    loading: "Loading...",
    saving: "Saving...",
    viewLive: "View Live",
    copyUrl: "Copy URL",
    copied: "Copied!",
    deleteConfirm: "Are you sure you want to delete this item?",
    langSwitch: "বাংলা",
  },
  bn: {
    // Navigation
    navDashboard: "ড্যাশবোর্ড",
    navLinks: "লিংক লাইব্রেরি",
    navPages: "পেইজসমূহ",
    navMainSite: "মূল ওয়েবসাইট",
    navAnalytics: "অ্যানালিটিক্স",
    navSettings: "সেটিংস",
    navCreatePage: "নতুন পেইজ তৈরি",
    navViewHub: "ওয়েবসাইট দেখুন",
    navSignOut: "লগআউট",
    navControlCenter: "কন্ট্রোল সেন্টার",
    navProductionLive: "লাইভ সক্রিয়",
    navPublic: "পাবলিক",

    // Dashboard
    dashTitle: "ড্যাশবোর্ড ওভারভিউ",
    dashSubtitle: "রিয়েল-টাইম অ্যানালিটিক্স, পেইজ ও লিংক মনিটরিং",
    dashCreatePage: "পেইজ তৈরি",
    dashLinkLibrary: "লিংক লাইব্রেরি",
    dashTotalViews: "মোট ভিউ",
    dashAcrossAll: "সকল পেইজ মিলিয়ে",
    dashLinkClicks: "লিংক ক্লিক",
    dashOutboundTaps: "লিংকে মোট ক্লিক",
    dashAvgCtr: "গড় সিটিআর (CTR)",
    dashConversionRate: "ক্লিক রূপান্তর হার",
    dashTotalPages: "মোট পেইজ",
    dashActivePages: "টি সক্রিয়",
    dashTopPages: "জনপ্রিয় পেইজসমূহ",
    dashManageAll: "সবগুলো দেখুন",
    dashComponentsCount: "টি কম্পোনেন্ট",
    dashViews: "ভিউ",
    dashClicks: "ক্লিক",
    dashSessions: "সেশন",
    dashTopLinks: "সবচেয়ে বেশি ক্লিক হওয়া লিংক",
    dashViewLibrary: "লাইব্রেরি দেখুন",
    dashUsedIn: "যুক্ত আছে",
    dashTrafficSources: "ট্রাফিক উৎস ও রেফারার",
    dashVisitorDevices: "ভিজিটরের ডিভাইস",
    dashNoData: "এখনও কোনো ডাটা নেই।",

    // Links Management
    linksTitle: "লিংক লাইব্রেরি",
    linksSubtitle: "আপনার অফিসিয়াল সোশ্যাল লিংক, ব্যাজ ও ইউআরএল পরিচালনা করুন",
    linksAddNew: "নতুন লিংক যুক্ত করুন",
    linksSearchPlaceholder: "শিরোনাম বা ইউআরএল দিয়ে খুঁজুন...",
    linksAllCategories: "সকল ক্যাটাগরি",
    linksTotalCount: "মোট লিংক",
    linksActiveStatus: "সক্রিয়",
    linksInactiveStatus: "নিষ্ক্রিয়",
    linksEdit: "এডিট",
    linksDelete: "ডিলিট",
    linksClicks: "ক্লিক সংখ্যা",
    linksCategory: "ক্যাটাগরি",
    linksBadge: "ব্যাজ",
    linksDestination: "লিংক গন্তব্য",
    linksModalAddTitle: "নতুন লিংক যোগ করুন",
    linksModalEditTitle: "লিংক তথ্য পরিবর্তন করুন",
    linksFieldTitle: "লিংকের শিরোনাম",
    linksFieldUrl: "টার্গেট ইউআরএল (URL)",
    linksFieldDesc: "বিবরণ / সাবটাইটেল",
    linksFieldIcon: "আইকন বা ব্র্যান্ড নির্বাচন করুন",
    linksFieldType: "কম্পোনেন্ট টাইপ",
    linksFieldCategory: "ক্যাটাগরি",
    linksFieldBadge: "হাইলাইট ব্যাজ",
    linksFieldStatus: "সক্রিয় স্ট্যাটাস",
    linksBtnSave: "লিংক সংরক্ষণ করুন",
    linksBtnCancel: "বাতিল করুন",

    // Settings
    settingsTitle: "ব্র্যান্ড ও প্ল্যাটফর্ম সেটিংস",
    settingsSubtitle: "আপনার প্রোফাইল নাম, বায়ো, থিম কালার ও সিকিউরিটি পরিচালনা করুন",
    settingsSaveSuccess: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
    settingsBrandIdentity: "ব্র্যান্ড পরিচিতি",
    settingsBrandName: "ব্র্যান্ড / ডিসপ্লে নাম",
    settingsUsername: "ইউজারনেম / হ্যান্ডেল",
    settingsBio: "বায়ো বিবরণ",
    settingsAvatarUrl: "প্রোফাইল ছবির লিংক (URL)",
    settingsAccentColor: "থিমের মূল কালার (Accent Color)",
    settingsAnnouncement: "অ্যানাউন্সমেন্ট ব্যানার",
    settingsAnnouncementToggle: "ওয়েবসাইটের শীর্ষে অ্যানাউন্সমেন্ট ব্যানার প্রদর্শন করুন",
    settingsAnnouncementText: "ব্যানার বার্তা",
    settingsAnnouncementUrl: "ব্যানারে ক্লিক করলে যাওয়ার লিংক (ঐচ্ছিক)",
    settingsSeoMetadata: "এসইও ও সোশ্যাল শেয়ারিং",
    settingsSeoTitle: "এসইও মেটা টাইটেল",
    settingsSeoDescription: "এসইও মেটা বিবরণ",
    settingsSecurity: "অ্যাডমিন পাসওয়ার্ড ও সিকিউরিটি",
    settingsCurrentPass: "বর্তমান পাসওয়ার্ড",
    settingsNewPass: "নতুন পাসওয়ার্ড",
    settingsBtnSave: "সকল পরিবর্তন সংরক্ষণ করুন",

    // Pages Management
    pagesTitle: "ডাইনামিক পেইজ ও স্ল্যাগ",
    pagesSubtitle: "আপনার মূল হাব এবং আলাদা ক্যাম্পেইন পেইজগুলো পরিচালনা করুন",
    pagesCreateNew: "নতুন পেইজ তৈরি",
    pagesMainSiteBadge: "মূল হাব",
    pagesSlug: "স্ল্যাগ (Slug)",
    pagesStatus: "স্ট্যাটাস",
    pagesActions: "অ্যাকশন",

    // Common
    loading: "লোড হচ্ছে...",
    saving: "সংরক্ষণ হচ্ছে...",
    viewLive: "লাইভ দেখুন",
    copyUrl: "লিংক কপি",
    copied: "কপি হয়েছে!",
    deleteConfirm: "আপনি কি নিশ্চিতভাবে এটি মুছে ফেলতে চান?",
    langSwitch: "English",
  },
};

interface AdminLanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => translations.en[key] || String(key),
});

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("linkhub_admin_lang") as AdminLanguage | null;
      if (saved === "en" || saved === "bn") {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage error ignore
    }
  }, []);

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("linkhub_admin_lang", lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <AdminLanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  return useContext(AdminLanguageContext);
}

export function LanguageSwitcherButton({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useAdminLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border border-white/10 active:scale-95 shadow-sm ${
        language === "bn"
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      } ${className}`}
      title={language === "en" ? "Switch to বাংলা (Bengali)" : "Switch to English"}
    >
      <span className="text-sm leading-none">{language === "en" ? "🇬🇧" : "🇧🇩"}</span>
      <span>{language === "en" ? "বাংলা" : "English"}</span>
    </button>
  );
}

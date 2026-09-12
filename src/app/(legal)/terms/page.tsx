import React from "react";
import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — LinkHub",
  description: "Read LinkHub's Terms of Service. Understand the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-6 h-6 text-indigo-400" />
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      </div>
      <p className="text-xs text-slate-500 mb-8">Last updated: September 2026</p>

      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            By accessing or using LinkHub (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, visitors, and others who access or use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Description of Service</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LinkHub provides a link management, bio-page creation, and content gateway platform. Users can create personalized link pages, shorten URLs, and access our content network. The Platform may include features such as link analytics, customization tools, and content monetization options.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. User Accounts</h2>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must not share your account with others or allow unauthorized access.</li>
            <li>You must be at least 13 years old to create an account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Acceptable Use</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-2">
            You agree not to use LinkHub to:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li>Share illegal, harmful, or fraudulent content</li>
            <li>Distribute malware, viruses, or other harmful software</li>
            <li>Engage in phishing, scamming, or deceptive practices</li>
            <li>Violate intellectual property rights of others</li>
            <li>Generate artificial clicks or views to manipulate analytics</li>
            <li>Share content that promotes gambling, violence, or explicit material</li>
            <li>Attempt to hack, disable, or interfere with the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Content Guidelines</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            All content shared through LinkHub must comply with applicable laws and regulations. We reserve the right to remove any content that violates these terms or that we deem inappropriate. Users are solely responsible for the content they share and the links they create.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">6. Intellectual Property</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The LinkHub platform, including its design, code, logo, and content, is the intellectual property of LinkHub and is protected by copyright and trademark laws. You retain ownership of content you create and share through the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">7. Advertisements</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LinkHub may display advertisements on certain pages, including gateway pages and content articles. These advertisements are served by third-party advertising networks such as Google AdSense. By using the Platform, you acknowledge and consent to the display of such advertisements.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">8. Limitation of Liability</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LinkHub is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages. We do not guarantee the accuracy, completeness, or availability of any content or services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">9. Termination</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion. Upon termination, your right to use the Platform will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">10. Changes to Terms</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We may modify these Terms of Service at any time. Changes will be effective when posted on this page. Your continued use of the Platform after changes are posted constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">11. Contact</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            For questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:support@linkhub.me" className="text-indigo-400 hover:underline">
              support@linkhub.me
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

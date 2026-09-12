import React from "react";
import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — LinkHub",
  description: "Read LinkHub's Privacy Policy. Learn how we collect, use, and protect your personal information when using our platform.",
};

export default function PrivacyPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-6 h-6 text-indigo-400" />
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      </div>
      <p className="text-xs text-slate-500 mb-8">Last updated: September 2026</p>

      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Information We Collect</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-2">
            When you use LinkHub, we may collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li><strong className="text-white">Account Information:</strong> When you create an account, we collect your name, email address, and password (stored as a secure hash).</li>
            <li><strong className="text-white">Usage Data:</strong> We collect anonymized data about how you use our platform, including page views, link clicks, device type, and browser information.</li>
            <li><strong className="text-white">Cookies:</strong> We use essential cookies for authentication and session management. Third-party advertising partners (such as Google AdSense) may also use cookies to serve relevant advertisements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li>To provide and maintain our services</li>
            <li>To personalize your experience</li>
            <li>To analyze usage patterns and improve our platform</li>
            <li>To communicate with you about updates and support</li>
            <li>To display relevant advertisements through our advertising partners</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. Third-Party Services</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-2">
            We may use third-party services that collect, monitor, and analyze data:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li><strong className="text-white">Google AdSense:</strong> We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your prior visits. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
            <li><strong className="text-white">Analytics:</strong> We use analytics tools to understand how our platform is used and to improve our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Data Security</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. This includes encryption of sensitive data, secure authentication protocols, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Data Retention</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy. Analytics data is aggregated and anonymized after 90 days. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">6. Your Rights</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-2">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-300 leading-relaxed space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of personalized advertisements</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">7. Children&apos;s Privacy</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            LinkHub does not knowingly collect personal information from children under the age of 13. If we discover that we have collected such information, we will promptly delete it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">8. Changes to This Policy</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">9. Contact Us</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:support@linkhub.me" className="text-indigo-400 hover:underline">
              support@linkhub.me
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

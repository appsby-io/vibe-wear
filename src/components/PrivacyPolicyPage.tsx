import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-source-sans"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 prose prose-gray max-w-none">
          
          <p className="text-sm text-gray-500 font-source-sans mb-6">
            <em>Last updated: 15 June 2025</em>
          </p>

          <p className="font-source-sans">
            Welcome to <strong>Vibe-Wear</strong> (https://vibe-wear.ai). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our site.
          </p>

          <hr className="my-8" />

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">1. Who We Are</h3>
          <p className="font-source-sans mb-6">
            Vibe-Wear is operated by <strong>Appsby UG (haftungsbeschränkt)</strong>, located in Berlin, Germany.
          </p>
          <p className="font-source-sans mb-6">
            If you have any questions, contact us at: [your@email.com]
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">2. What Data We Collect</h3>
          <p className="font-source-sans mb-4">We collect the following types of data:</p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li><strong>Email address</strong> (when you join our waitlist)</li>
            <li><strong>Prompt text</strong> you enter (for AI image generation)</li>
            <li><strong>Generated images</strong> (temporarily stored for preview purposes)</li>
            <li><strong>Analytics data</strong> (via Google Analytics 4)</li>
            <li><strong>Cookie consent status</strong></li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">3. How We Use Your Data</h3>
          <p className="font-source-sans mb-4">We use your data to:</p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li>Contact you about product updates (if you've joined our waitlist)</li>
            <li>Improve our product and UX based on usage patterns</li>
            <li>Understand user interest and feature requests</li>
            <li>Maintain website security and performance</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">4. How We Store and Protect Your Data</h3>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li>Emails are securely stored in <strong>Supabase</strong> (PostgreSQL database)</li>
            <li>Prompt and image data is ephemeral and not stored long-term</li>
            <li>We use <strong>HTTPS</strong> encryption and access controls to protect your data</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">5. Analytics & Cookies</h3>
          <p className="font-source-sans mb-4">
            We use <strong>Google Analytics 4</strong> to collect anonymous usage data. Cookies may be used to:
          </p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li>Remember your consent preferences</li>
            <li>Track engagement (if you accept cookies)</li>
          </ul>
          <p className="font-source-sans mb-6">
            We show a cookie banner that allows you to opt out of tracking.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">6. Third-Party Services</h3>
          <p className="font-source-sans mb-4">We use the following services which may process your data:</p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li><strong>Supabase</strong> (email storage)</li>
            <li><strong>OpenAI</strong> (image generation based on your prompts)</li>
            <li><strong>Netlify</strong> (hosting)</li>
            <li><strong>Google Analytics</strong> (usage tracking)</li>
            <li><strong>Google Forms</strong> (feedback collection)</li>
          </ul>
          <p className="font-source-sans mb-6">
            Each provider has its own privacy policies and complies with applicable data protection laws.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">7. Your Rights (under GDPR)</h3>
          <p className="font-source-sans mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li>Access, correct, or delete your data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p className="font-source-sans mb-6">
            To exercise your rights, contact us at: [your@email.com]
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">8. Changes to This Policy</h3>
          <p className="font-source-sans mb-6">
            We may update this Privacy Policy. The latest version will always be available on our website with the updated date.
          </p>

          <hr className="my-8" />

          <p className="font-bold font-source-sans">
            By using our website, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
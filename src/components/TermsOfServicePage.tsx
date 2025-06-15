import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
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
            <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Terms of Service</h1>
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
            Welcome to <strong>Vibe-Wear</strong> (https://vibe-wear.ai). These Terms of Service ("Terms") govern your access to and use of our website, services, and products. By accessing or using Vibe-Wear, you agree to be bound by these Terms.
          </p>

          <hr className="my-8" />

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">1. About Vibe-Wear</h3>
          <p className="font-source-sans mb-6">
            Vibe-Wear allows users to generate AI-designed motifs for apparel using OpenAI's image generation technology. Users can preview designs and, when available, order products printed on demand.
          </p>
          <p className="font-source-sans mb-6">
            Vibe-Wear is operated by <strong>Appsby UG (haftungsbeschränkt)</strong>, located in Berlin, Germany.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">2. Use of the Site</h3>
          <p className="font-source-sans mb-4">By using this site, you agree to:</p>
          <ul className="list-disc pl-6 mb-6 font-source-sans">
            <li>Provide accurate information (e.g., email address) when requested</li>
            <li>Use the site only for lawful purposes</li>
            <li>Not attempt to reverse-engineer or misuse the AI generation process</li>
          </ul>
          <p className="font-source-sans mb-6">
            You must be at least 16 years old or have permission from a legal guardian.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">3. Intellectual Property</h3>
          <p className="font-source-sans mb-6">
            All content on the site, including the UI design, layout, and custom prompts, is owned by Vibe-Wear. You retain rights to any personal prompts you enter, but Vibe-Wear and OpenAI may store and analyze data for research and improvement purposes.
          </p>
          <p className="font-source-sans mb-6">
            Generated images are for personal, non-commercial use unless otherwise agreed.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">4. AI Content Disclaimer</h3>
          <p className="font-source-sans mb-6">
            Vibe-Wear uses third-party AI services (e.g., OpenAI) to generate images. We do not guarantee the accuracy, appropriateness, or originality of generated content.
          </p>
          <p className="font-source-sans mb-6">
            We reserve the right to block or remove content that violates these terms or applicable laws.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">5. Waitlist and Emails</h3>
          <p className="font-source-sans mb-6">
            By submitting your email, you agree to be contacted about Vibe-Wear product updates, early access opportunities, and feedback forms. You can unsubscribe at any time.
          </p>
          <p className="font-source-sans mb-6">
            We use Supabase to store emails securely. See our <a href="/privacy-policy" className="text-vibrant-pink hover:underline">Privacy Policy</a> for more information.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">6. Limitation of Liability</h3>
          <p className="font-source-sans mb-6">
            To the extent permitted by law, Vibe-Wear shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service, including AI-generated content or third-party service interruptions.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">7. Modifications</h3>
          <p className="font-source-sans mb-6">
            We may update these Terms at any time. Continued use of the service after changes means you accept the updated Terms. The latest version will always be available on our site.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 font-source-sans">8. Governing Law</h3>
          <p className="font-source-sans mb-6">
            These Terms are governed by the laws of Germany. Any disputes will be subject to the exclusive jurisdiction of the courts in Berlin.
          </p>

          <hr className="my-8" />

          <p className="font-source-sans">
            If you have any questions about these Terms, contact us at: [your@email.com]
          </p>
        </div>
      </div>
    </div>
  );
};
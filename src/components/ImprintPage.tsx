import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ImprintPageProps {
  onBack: () => void;
}

export const ImprintPage: React.FC<ImprintPageProps> = ({ onBack }) => {
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
            <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Impressum</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">Impressum</h2>
            
            <div className="space-y-2 text-gray-700 font-source-sans">
              <p className="font-semibold">Appsby UG (haftungsbeschränkt)</p>
              <p>Magdalena Okorie</p>
              <p>Am Parkfeld 6a</p>
              <p>65203 Wiesbaden</p>
            </div>
            
            <div className="mt-6 space-y-2 text-gray-700 font-source-sans">
              <p><span className="font-medium">USt-ID:</span> DE328555588</p>
              <p>
                <span className="font-medium">Kontakt:</span>{' '}
                <a 
                  href="mailto:magdalena@appsby.io" 
                  className="text-vibrant-pink hover:underline"
                >
                  magdalena@appsby.io
                </a>
              </p>
            </div>
          </div>

          {/* Liability Notice */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-source-sans">
              Liability Notice
            </h3>
            <p className="text-gray-700 leading-relaxed font-source-sans">
              In spite of careful monitoring of the content, we do not accept liability for the content of external links. 
              The operators of the linked pages are solely responsible for the content thereof.
            </p>
          </div>

          {/* Dispute Resolution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-source-sans">
              Dispute Resolution
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed font-source-sans">
              <p>
                The European Commission provides an online platform at{' '}
                <a 
                  href="https://www.ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-vibrant-pink hover:underline"
                >
                  www.ec.europa.eu/consumers/odr
                </a>{' '}
                for resolving disputes out of court. You will find our email address in the Legal section of our website.
              </p>
              <p>
                Please note that we are not obliged to and thus do not participate in the settlement of disputes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
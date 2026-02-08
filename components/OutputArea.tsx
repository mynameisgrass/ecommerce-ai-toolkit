import React from 'react';
import { Copy, Download, Check, Sparkles } from 'lucide-react';
import { ProcessingResult } from '../types';

interface OutputAreaProps {
  result: ProcessingResult | null;
  isLoading: boolean;
  error: string | null;
}

const OutputArea: React.FC<OutputAreaProps> = ({ result, isLoading, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result?.content && result.type === 'image') {
      const link = document.createElement('a');
      link.href = result.content;
      link.download = `gemini-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // If no activity, keep the interface clean by rendering nothing
  if (!result && !isLoading && !error) {
    return null;
  }

  return (
    <div className="w-full border-t border-indigo-100 bg-indigo-50/30 p-6 md:p-10 animate-fade-in">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI is working its magic...</h3>
            <p className="text-gray-500 mt-1 text-sm">
              Creating your content, please wait.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Oops!</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Result State */}
        {result && (
          <div className="flex flex-col animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Result
              </h2>
              <div className="flex gap-2">
                {result.type === 'text' && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
                {result.type === 'image' && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {result.type === 'image' ? (
                <div className="p-4 flex items-center justify-center bg-gray-100 min-h-[300px]">
                  <img
                    src={result.content}
                    alt="Generated"
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="p-6 bg-white text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {result.content}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputArea;

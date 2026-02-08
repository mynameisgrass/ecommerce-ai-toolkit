import React, { useState } from 'react';
import { Layers, Video, FileText, Wand2, AlertCircle } from 'lucide-react';
import { Tab, ImageProcessType, VideoDuration } from '../types';
import ImageUploader from './ImageUploader';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onGenerate, isLoading }) => {
  // Local state for form inputs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageProcessType, setImageProcessType] = useState<ImageProcessType>(ImageProcessType.CLOTHING);
  const [videoDuration, setVideoDuration] = useState<VideoDuration>(VideoDuration.FIFTEEN_SEC);
  const [videoExtraText, setVideoExtraText] = useState('');
  const [salesScriptText, setSalesScriptText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setValidationError(null);
  };

  const handleGenerate = () => {
    setValidationError(null);

    // Validation
    if ((activeTab === Tab.IMAGE_PROCESSING || activeTab === Tab.VIDEO_PROMPT) && !selectedFile) {
      setValidationError("Please upload an image first.");
      return;
    }
    if (activeTab === Tab.SALES_SCRIPT && !salesScriptText.trim()) {
      setValidationError("Please enter a product description.");
      return;
    }

    // Payload construction
    let payload = {};
    if (activeTab === Tab.IMAGE_PROCESSING) {
      payload = { file: selectedFile, type: imageProcessType };
    } else if (activeTab === Tab.VIDEO_PROMPT) {
      payload = { file: selectedFile, duration: videoDuration, extraText: videoExtraText };
    } else if (activeTab === Tab.SALES_SCRIPT) {
      payload = { text: salesScriptText };
    }

    onGenerate(payload);
  };

  const tabs = [
    { id: Tab.IMAGE_PROCESSING, label: 'Tách Ảnh', icon: Layers },
    { id: Tab.VIDEO_PROMPT, label: 'Làm Video', icon: Video },
    { id: Tab.SALES_SCRIPT, label: 'Lấy Prompt', icon: FileText },
  ];

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h1 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-indigo-600" />
            E-com AI Toolkit
          </h1>
          <p className="text-sm text-gray-500 mt-1">Supercharge your product listings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center p-4 text-sm font-medium transition-colors gap-2 ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:inline md:hidden">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
          
          {/* Error Message */}
          {validationError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2 border border-red-100 animate-fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {validationError}
            </div>
          )}

          {/* Feature 1: Image Processing */}
          {activeTab === Tab.IMAGE_PROCESSING && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Product Image</label>
                <ImageUploader selectedFile={selectedFile} onFileSelect={setSelectedFile} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Processing Mode</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="imgType"
                      checked={imageProcessType === ImageProcessType.CLOTHING}
                      onChange={() => setImageProcessType(ImageProcessType.CLOTHING)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block font-medium text-gray-900">Separate Clothing</span>
                      <span className="block text-xs text-gray-500">Remove model, flat-lay style, white bg</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="imgType"
                      checked={imageProcessType === ImageProcessType.PRODUCT}
                      onChange={() => setImageProcessType(ImageProcessType.PRODUCT)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block font-medium text-gray-900">Separate Product</span>
                      <span className="block text-xs text-gray-500">Isolate object, clean edges, white bg</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Feature 2: Video Prompt */}
          {activeTab === Tab.VIDEO_PROMPT && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Reference Image</label>
                <ImageUploader selectedFile={selectedFile} onFileSelect={setSelectedFile} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Info (Optional)</label>
                <input
                  type="text"
                  placeholder="Giới thiệu chung về sản phẩm..."
                  value={videoExtraText}
                  onChange={(e) => setVideoExtraText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Video Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVideoDuration(VideoDuration.FIFTEEN_SEC)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      videoDuration === VideoDuration.FIFTEEN_SEC
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    15 Seconds
                    <span className="block text-xs font-normal mt-1 opacity-75">Review style</span>
                  </button>
                  <button
                    onClick={() => setVideoDuration(VideoDuration.SIXTY_SEC)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      videoDuration === VideoDuration.SIXTY_SEC
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    60 Seconds
                    <span className="block text-xs font-normal mt-1 opacity-75">Storytelling (4 scenes)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feature 3: Sales Script */}
          {activeTab === Tab.SALES_SCRIPT && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Description</label>
                <textarea
                  placeholder="Paste your product description here... (e.g., features, benefits, target audience)"
                  value={salesScriptText}
                  onChange={(e) => setSalesScriptText(e.target.value)}
                  className="w-full min-h-[160px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full max-w-md py-3.5 px-6 rounded-lg text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              {activeTab === Tab.IMAGE_PROCESSING ? 'Generate Images' : 
               activeTab === Tab.VIDEO_PROMPT ? 'Generate Sora Prompt' : 
               'Generate Script'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

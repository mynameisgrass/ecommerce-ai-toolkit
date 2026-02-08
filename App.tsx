import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import OutputArea from './components/OutputArea';
import { Tab, AppState } from './types';
import { generateImageSeparation, generateVideoPrompt, generateSalesScript } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    activeTab: Tab.IMAGE_PROCESSING,
    isLoading: false,
    result: null,
    error: null,
  });

  const setActiveTab = (tab: Tab) => {
    setState((prev) => ({ ...prev, activeTab: tab, result: null, error: null }));
  };

  const handleGenerate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, result: null }));

    try {
      let content = '';
      let type: 'text' | 'image' = 'text';

      if (state.activeTab === Tab.IMAGE_PROCESSING) {
        content = await generateImageSeparation(data.file, data.type);
        type = 'image';
      } else if (state.activeTab === Tab.VIDEO_PROMPT) {
        content = await generateVideoPrompt(data.file, data.duration, data.extraText);
        type = 'text';
      } else if (state.activeTab === Tab.SALES_SCRIPT) {
        content = await generateSalesScript(data.text);
        type = 'text';
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        result: {
          type,
          content,
          timestamp: Date.now(),
        },
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "An unexpected error occurred.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 font-sans flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col mb-10">
        <Sidebar
          activeTab={state.activeTab}
          setActiveTab={setActiveTab}
          onGenerate={handleGenerate}
          isLoading={state.isLoading}
        />
        <OutputArea
          result={state.result}
          isLoading={state.isLoading}
          error={state.error}
        />
      </div>
    </div>
  );
};

export default App;

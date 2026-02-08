import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedFile, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert("Please upload a valid image file (JPG, PNG).");
    }
  };

  const clearFile = () => {
    onFileSelect(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Sync preview with prop if prop is cleared externally
  React.useEffect(() => {
    if (!selectedFile && previewUrl) {
       clearFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg"
      />
      
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-3 bg-indigo-100 rounded-full mb-3">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max. 5MB)</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
          <div className="aspect-video w-full relative bg-gray-100 flex items-center justify-center overflow-hidden">
             {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
             ) : (
                <ImageIcon className="text-gray-400 w-12 h-12" />
             )}
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{selectedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import sampleImageSrc from '../assets/images/architectural_atrium_geometry_1790610300810.jpg';

interface ImageUploaderProps {
  image: string | null;
  mimeType: string;
  fileName: string;
  isLoading: boolean;
  hasAnalysis: boolean;
  languageMode: 'arabic' | 'english' | 'bilingual';
  onImageSelected: (dataUrl: string, mime: string, name: string) => void;
  onAnalyze: () => void;
  onReanalyze: () => void;
  onClear: () => void;
  onError: (msg: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  fileName,
  isLoading,
  hasAnalysis,
  languageMode,
  onImageSelected,
  onAnalyze,
  onReanalyze,
  onClear,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isArabic = languageMode === 'arabic';

  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const processFile = (file: File) => {
    if (!supportedTypes.includes(file.type.toLowerCase())) {
      onError(
        isArabic
          ? 'صيغة الملف غير مدعومة. يرجى تحميل صورة بصيغة JPG أو JPEG أو PNG أو WEBP.'
          : 'Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP photograph.'
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      onError(
        isArabic
          ? 'حجم الصورة كبير جداً. يرجى اختيار صورة بحجم أقل من 25 ميغابايت.'
          : 'File is too large. Please select a photograph under 25MB.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type, file.name);
      }
    };
    reader.onerror = () => {
      onError(
        isArabic
          ? 'فشل في قراءة ملف الصورة. يرجى تجربة صورة أخرى.'
          : 'Failed to read the image file. Please try another image.'
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleImage = async () => {
    try {
      const response = await fetch(sampleImageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelected(
          base64,
          'image/jpeg',
          'curated_architectural_geometry_study.jpg'
        );
      };
      reader.readAsDataURL(blob);
    } catch {
      onError(
        isArabic
          ? 'تعذر تحميل الصورة النموذجية.'
          : 'Could not load the sample photograph.'
      );
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Upload Box or Image Preview */}
      {!image ? (
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer group relative border-2 border-dashed rounded-xl p-10 sm:p-14 text-center transition-all duration-300 ${
            isDragging
              ? 'border-stone-900 bg-stone-100/80 scale-[1.005]'
              : 'border-stone-300 hover:border-stone-500 bg-white/60 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="w-8 h-8 stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <p className={`text-lg sm:text-xl font-medium text-stone-900 ${isArabic ? 'font-arabic-heading' : 'font-serif-display'}`}>
                {isArabic ? 'اسحب وأفلت صورتك الفوتوغرافية هنا' : 'Drag & Drop Your Photograph Here'}
              </p>
              <p className={`text-stone-500 text-sm ${isArabic ? 'font-arabic-art' : 'font-sans-clean'}`}>
                {isArabic ? 'أو انقر لتصفح أرشيفك المحلي' : 'or click to browse your local archive'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-stone-400 font-sans-clean tracking-wider uppercase">
              <span>JPG</span>
              <span>·</span>
              <span>JPEG</span>
              <span>·</span>
              <span>PNG</span>
              <span>·</span>
              <span>WEBP</span>
              <span>·</span>
              <span>{isArabic ? 'حتى 25 ميغابايت' : 'Up to 25MB'}</span>
            </div>

            {/* Quick Sample Button */}
            <div className="pt-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={loadSampleImage}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-stone-600" />
                <span className={isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}>
                  {isArabic
                    ? 'تحميل صورة نموذجية (دراسة في الهندسة المعمارية)'
                    : 'Load Sample Photograph (Architectural Geometry)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-6 sm:p-8 space-y-6">
          {/* Prominent Image Preview with Museum Matting Frame */}
          <div className="relative group max-w-4xl mx-auto rounded-lg overflow-hidden bg-stone-950 p-2 sm:p-4 shadow-inner">
            <div className="relative flex items-center justify-center min-h-[300px] max-h-[640px] overflow-hidden rounded bg-stone-900">
              <img
                src={image}
                alt={fileName || 'Uploaded photograph for symbolic analysis'}
                className="max-h-[600px] w-auto max-w-full object-contain mx-auto transition-transform duration-500"
              />
            </div>
          </div>

          {/* Image Information & Primary Control Buttons */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-100"
          >
            <div className="flex items-center gap-3 text-stone-600 text-xs sm:text-sm truncate max-w-md">
              <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0" />
              <span className={`truncate font-medium ${isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
                {fileName || (isArabic ? 'الصورة الأصلية' : 'Original Photograph')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {/* Clear Image Button */}
              <button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className={isArabic ? 'font-arabic-art' : 'font-sans-clean'}>
                  {isArabic ? 'مسح الصورة' : 'Clear Image'}
                </span>
              </button>

              {/* Re-analyze Button */}
              {hasAnalysis && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-800 hover:text-stone-950 bg-stone-200 hover:bg-stone-300 rounded-md transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className={isArabic ? 'font-arabic-art' : 'font-sans-clean'}>
                    {isArabic ? 'إعادة التحليل' : 'Re-analyze'}
                  </span>
                </button>
              )}

              {/* Analyze Photographic Symbolism Button */}
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] rounded-md shadow-xs transition-all disabled:opacity-60 whitespace-nowrap cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className={isArabic ? 'font-arabic-art' : 'font-sans-clean'}>
                      {isArabic ? 'جاري تحليل الرمزية بواسطة Gemini...' : 'Analyzing Symbolism with Gemini...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-stone-200" />
                    <span className={isArabic ? 'font-arabic-heading text-sm' : 'font-sans-clean'}>
                      {isArabic ? 'تحليل رمزية الصورة الفوتوغرافية' : 'Analyze Photographic Symbolism'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

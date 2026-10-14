import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisPlate } from './components/AnalysisPlate';
import { PrintDocumentTemplate } from './components/PrintDocumentTemplate';
import { AnalysisData, exportWordDocument, exportPdfDocument } from './utils/exportUtils';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  const [languageMode, setLanguageMode] = useState<'arabic' | 'english' | 'bilingual'>('arabic');
  const [error, setError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [pdfExportMode, setPdfExportMode] = useState<'arabic' | 'english' | 'bilingual'>('arabic');

  // Update HTML document direction and lang attribute whenever languageMode changes
  useEffect(() => {
    if (languageMode === 'arabic') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [languageMode]);

  const handleImageSelected = (dataUrl: string, mime: string, name: string) => {
    setImage(dataUrl);
    setMimeType(mime);
    setFileName(name);
    setError(null);
    setExportNotice(null);
  };

  const handleClearImage = () => {
    setImage(null);
    setFileName('');
    setAnalysisResult(null);
    setError(null);
    setExportNotice(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError(
        languageMode === 'arabic'
          ? 'يرجى تحميل أو اختيار صورة فوتوغرافية قبل بدء التحليل.'
          : 'Please upload or select a photograph before analyzing.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setExportNotice(null);

    try {
      const response = await fetch('/api/analyze-symbolism', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: image,
          mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze the photographic symbolism.');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err.message ||
          (languageMode === 'arabic'
            ? 'فشل التحليل. يرجى التأكد من ضبط مفتاح GEMINI_API_KEY أو المحاولة مجدداً.'
            : 'Analysis failed. Please check your image or ensure GEMINI_API_KEY is configured.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportWord = async (mode: 'arabic' | 'english' | 'bilingual') => {
    if (!analysisResult || !image) {
      setError(
        languageMode === 'arabic'
          ? 'لا يوجد تحليل متاح للتصدير. يرجى تحليل صورة أولاً.'
          : 'No analysis available to export. Please analyze a photograph first.'
      );
      return;
    }

    const label = `Word (.docx) ${mode.toUpperCase()}`;
    setIsExporting(label);
    setExportNotice(null);

    try {
      await exportWordDocument(mode, analysisResult, image);
      setExportNotice({
        type: 'success',
        message:
          languageMode === 'arabic'
            ? `تم تصدير مستند ${mode === 'arabic' ? 'Word بالعربية' : mode === 'bilingual' ? 'Word ثنائي اللغة' : 'Word بالإنجليزية'} بنجاح.`
            : `Successfully exported ${label} document. Check your downloads.`,
      });
    } catch (err: any) {
      console.error('Word export error:', err);
      setExportNotice({
        type: 'error',
        message: `Failed to export Word document: ${err.message || 'Unknown error'}.`,
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async (mode: 'arabic' | 'english' | 'bilingual') => {
    if (!analysisResult || !image) {
      setError(
        languageMode === 'arabic'
          ? 'لا يوجد تحليل متاح للتصدير. يرجى تحليل صورة أولاً.'
          : 'No analysis available to export. Please analyze a photograph first.'
      );
      return;
    }

    const label = `A4 PDF ${mode.toUpperCase()}`;
    setIsExporting(label);
    setPdfExportMode(mode);
    setExportNotice(null);

    try {
      // Allow React to re-render the hidden PrintDocumentTemplate with the chosen mode
      await new Promise((resolve) => setTimeout(resolve, 160));
      await exportPdfDocument('pdf-print-container', mode);
      setExportNotice({
        type: 'success',
        message:
          languageMode === 'arabic'
            ? `تم تصدير مستند ${mode === 'arabic' ? 'PDF بالعربية' : mode === 'bilingual' ? 'PDF ثنائي اللغة' : 'PDF بالإنجليزية'} بنجاح.`
            : `Successfully exported ${label} document. Check your downloads.`,
      });
    } catch (err: any) {
      console.error('PDF export error:', err);
      setExportNotice({
        type: 'error',
        message: `Failed to export PDF: ${err.message || 'Unknown error'}.`,
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div
      dir={languageMode === 'arabic' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-stone-200 transition-all duration-200"
    >
      {/* 1. Header with Title & Dr. Hisham AlKhatib attribution & Language Switcher */}
      <Header languageMode={languageMode} onLanguageChange={setLanguageMode} />

      {/* Global Notifications */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        {error && (
          <div
            dir={languageMode === 'arabic' ? 'rtl' : 'ltr'}
            className="flex items-start gap-3 p-4 mb-4 text-xs sm:text-sm text-stone-900 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className={`flex-1 ${languageMode === 'arabic' ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-stone-500 hover:text-stone-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {exportNotice && (
          <div
            dir={languageMode === 'arabic' ? 'rtl' : 'ltr'}
            className={`flex items-start gap-3 p-4 mb-4 text-xs sm:text-sm rounded-lg border ${
              exportNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            {exportNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className={`flex-1 ${languageMode === 'arabic' ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
              {exportNotice.message}
            </div>
            <button
              type="button"
              onClick={() => setExportNotice(null)}
              className="text-stone-500 hover:text-stone-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {/* 2. Image Upload / Prominent Display & Primary Action Controls */}
        <ImageUploader
          image={image}
          mimeType={mimeType}
          fileName={fileName}
          isLoading={isLoading}
          hasAnalysis={Boolean(analysisResult)}
          languageMode={languageMode}
          onImageSelected={handleImageSelected}
          onAnalyze={handleAnalyze}
          onReanalyze={handleAnalyze}
          onClear={handleClearImage}
          onError={(msg) => setError(msg)}
        />

        {/* 3. Analysis Plate & Document Export */}
        {analysisResult && image && (
          <AnalysisPlate
            data={analysisResult}
            image={image}
            languageMode={languageMode}
            onLanguageChange={setLanguageMode}
            onExportWord={handleExportWord}
            onExportPdf={handleExportPdf}
            isExporting={isExporting}
          />
        )}
      </main>

      {/* Hidden high-res container for generating pixel-perfect A4 PDF documents with proper RTL ligatures */}
      <PrintDocumentTemplate
        data={analysisResult}
        image={image}
        exportMode={pdfExportMode}
      />

      {/* Curatorial Fine Art Footer */}
      <footer
        dir={languageMode === 'arabic' ? 'rtl' : 'ltr'}
        className="border-t border-stone-200 bg-white/60 py-8 text-center text-xs text-stone-500 font-sans-clean"
      >
        <div className="max-w-4xl mx-auto px-6 space-y-2">
          {languageMode === 'arabic' ? (
            <>
              <p className="font-arabic-heading font-bold text-stone-800 text-sm tracking-wide">
                الرمزية في التصوير الفوتوغرافي
              </p>
              <p className="font-arabic-art text-sm text-stone-600">
                د. هشام الخطيب · استشاري الأشعة التشخيصية · مصوّر هاوٍ
              </p>
              <p className="font-arabic-art text-xs text-stone-400 pt-1">
                محرك السيميائيات البصرية والتحليل الفني للصور الفوتوغرافية
              </p>
            </>
          ) : (
            <>
              <p className="font-serif-display tracking-widest text-stone-700 uppercase">
                Photographic Symbolism
              </p>
              <p>
                Dr. Hisham AlKhatib · Consultant Radiologist · Amateur Photographer
              </p>
              <p className="text-stone-400 text-[11px] pt-1">
                Visual Semiotics &amp; Fine Art Photography Analysis Engine
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

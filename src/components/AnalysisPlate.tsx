import React, { useState } from 'react';
import {
  FileText,
  Download,
  Languages,
  ChevronDown,
  ChevronUp,
  Sliders,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AnalysisData } from '../utils/exportUtils';

interface AnalysisPlateProps {
  data: AnalysisData;
  image: string;
  languageMode: 'arabic' | 'english' | 'bilingual';
  onLanguageChange: (mode: 'arabic' | 'english' | 'bilingual') => void;
  onExportWord: (mode: 'arabic' | 'english' | 'bilingual') => void;
  onExportPdf: (mode: 'arabic' | 'english' | 'bilingual') => void;
  isExporting: string | null;
}

export const AnalysisPlate: React.FC<AnalysisPlateProps> = ({
  data,
  image,
  languageMode,
  onLanguageChange,
  onExportWord,
  onExportPdf,
  isExporting,
}) => {
  const [showDimensions, setShowDimensions] = useState(false);
  const isArabic = languageMode === 'arabic';

  const dimensionKeys = [
    { key: 'mainSubject', labelEn: '1. Main Visual Subject', labelAr: '١. الموضوع البصري الرئيسي' },
    { key: 'composition', labelEn: '2. Composition', labelAr: '٢. التكوين والتأطير' },
    { key: 'linesAndGeometry', labelEn: '3. Lines & Geometric Forms', labelAr: '٣. الخطوط والأشكال الهندسية' },
    { key: 'repetitionAndRhythm', labelEn: '4. Repetition & Visual Rhythm', labelAr: '٤. التكرار والإيقاع البصري' },
    { key: 'lightAndShadow', labelEn: '5. Light & Shadow', labelAr: '٥. الضوء والظلال (التدرج الضوئي)' },
    { key: 'contrast', labelEn: '6. Contrast', labelAr: '٦. التباين البصري والمفهومي' },
    { key: 'elementRelationships', labelEn: '7. Relationships Between Elements', labelAr: '٧. العلاقات بين العناصر البصرية' },
    { key: 'negativeSpace', labelEn: '8. Negative Space', labelAr: '٨. الفضاء السلبي والفراغ' },
    { key: 'depthAndPerspective', labelEn: '9. Depth & Perspective', labelAr: '٩. العمق ونقاط التلاشي' },
    { key: 'reflections', labelEn: '10. Reflections', labelAr: '١٠. الانعكاسات البصرية' },
    { key: 'movementAndDynamism', labelEn: '11. Movement & Dynamism', labelAr: '١١. الحركة والديناميكية البصرية' },
    { key: 'peopleAndPlace', labelEn: '12. Relationship of People & Place', labelAr: '١٢. علاقة الإنسان بالمكان' },
    { key: 'emotionalAndCultural', labelEn: '13. Emotional & Cultural Resonance', labelAr: '١٣. الإيحاءات الشعورية والثقافية' },
    { key: 'visualSymbols', labelEn: '14. Possible Visual Symbols', labelAr: '١٤. الرموز البصرية المحتملة' },
    { key: 'conceptualMeaning', labelEn: '15. Possible Conceptual Meaning', labelAr: '١٥. المعنى المفهومي والتأويلي' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* Visual Controls Bar: Language Selector & Direct Print */}
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white border border-stone-200 rounded-lg shadow-2xs"
      >
        {/* Language Selection Segmented Control */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-1 text-xs text-stone-500 font-medium">
            <Languages className="w-4 h-4 text-stone-600" />
            <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
              {isArabic ? 'طريقة العرض:' : 'Display Mode:'}
            </span>
          </div>

          <div className="flex items-center p-1 bg-stone-100 rounded-md">
            <button
              type="button"
              onClick={() => onLanguageChange('arabic')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                languageMode === 'arabic'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              العربية (RTL)
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('bilingual')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                languageMode === 'bilingual'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bilingual · ثنائي اللغة
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('english')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                languageMode === 'english'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* Quick Print Affordance */}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded-md transition-colors bg-white"
          title="Print or Save to PDF via Browser"
        >
          <Printer className="w-3.5 h-3.5 text-stone-500" />
          <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
            {isArabic ? 'معاينة الطباعة المباشرة' : 'Print Preview'}
          </span>
        </button>
      </div>

      {/* Main Fine Art Exhibition Result Card */}
      <article
        id="exhibition-result-plate"
        className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-14 shadow-xs transition-all duration-300"
      >
        {/* Exhibition Plate Header */}
        {isArabic ? (
          <div dir="rtl" className="text-center pb-8 border-b border-stone-100 space-y-2">
            <p className="font-arabic-heading text-xs tracking-widest text-stone-400">
              قراءة سيميائية معرضية
            </p>
            <h2 className="font-arabic-heading text-3xl sm:text-4xl font-bold tracking-wide text-stone-900">
              الرمزية في التصوير الفوتوغرافي
            </h2>
            <p className="font-arabic-art text-stone-700 text-2xl font-bold">
              د. هشام الخطيب
            </p>
            <div className="flex items-center justify-center gap-2 text-stone-500 font-arabic-heading text-xs">
              <span>استشاري الأشعة التشخيصية</span>
              <span aria-hidden="true">·</span>
              <span>مصوّر هاوٍ</span>
            </div>
          </div>
        ) : languageMode === 'bilingual' ? (
          <div className="text-center pb-8 border-b border-stone-100 space-y-2">
            <p className="font-serif-display text-xs tracking-[0.25em] text-stone-400 uppercase">
              Curatorial Exhibition Reading · قراءة سيميائية معرضية
            </p>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-medium tracking-wider text-stone-900">
              Photographic Symbolism
            </h2>
            <p className="font-editorial text-stone-600 text-lg sm:text-xl">
              Dr. Hisham AlKhatib · <span dir="rtl" className="font-arabic-art font-bold">د. هشام الخطيب</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-stone-400 font-sans-clean text-xs tracking-wider uppercase">
              <span>Consultant Radiologist</span>
              <span aria-hidden="true">·</span>
              <span>Amateur Photographer</span>
            </div>
          </div>
        ) : (
          <div dir="ltr" className="text-center pb-8 border-b border-stone-100 space-y-2">
            <p className="font-serif-display text-xs tracking-[0.25em] text-stone-400 uppercase">
              Curatorial Exhibition Reading
            </p>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-medium tracking-wider text-stone-900">
              Photographic Symbolism
            </h2>
            <p className="font-editorial text-stone-600 text-lg sm:text-xl">
              Dr. Hisham AlKhatib
            </p>
            <div className="flex items-center justify-center gap-2 text-stone-400 font-sans-clean text-xs tracking-wider uppercase">
              <span>Consultant Radiologist</span>
              <span aria-hidden="true">·</span>
              <span>Amateur Photographer</span>
            </div>
          </div>
        )}

        {/* Prominent High-Resolution Photograph Display */}
        <div className="my-10 max-w-3xl mx-auto">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg shadow-inner">
            <img
              src={image}
              alt={data.titleEnglish || data.titleArabic || 'Photographic study'}
              className="w-full max-h-[580px] object-contain mx-auto rounded"
            />
          </div>
        </div>

        {/* Render Based on Selected Language Mode */}

        {/* 1. ARABIC MODE (STRICT RIGHT-TO-LEFT) */}
        {languageMode === 'arabic' && (
          <div dir="rtl" className="space-y-8 max-w-3xl mx-auto text-right arabic-rtl">
            {/* Arabic Title */}
            <div className="space-y-2 text-right" dir="rtl">
              <span className="font-arabic-heading text-xs tracking-widest text-stone-400 block">
                العنوان المقترح
              </span>
              <h3 className="font-arabic-art text-3xl sm:text-4xl text-stone-950 font-bold leading-tight text-right">
                « {data.titleArabic} »
              </h3>
            </div>

            {/* Arabic Symbolism */}
            <div className="space-y-3 pt-6 border-t border-stone-100 text-right" dir="rtl">
              <div className="flex items-center justify-between" dir="rtl">
                <span className="font-arabic-heading text-base font-bold text-stone-900">
                  رمزية الصورة
                </span>
                <span className="text-xs text-stone-400 font-sans-clean" dir="ltr">
                  {data.arabicWordCount || 0} / 60 words
                </span>
              </div>
              <p
                dir="rtl"
                className="font-arabic-art text-2xl text-stone-800 leading-[2.1] text-right"
                style={{ direction: 'rtl', textAlign: 'right' }}
              >
                {data.symbolismArabic}
              </p>
            </div>
          </div>
        )}

        {/* 2. ENGLISH MODE (STRICT LEFT-TO-RIGHT) */}
        {languageMode === 'english' && (
          <div dir="ltr" className="space-y-8 max-w-3xl mx-auto text-left">
            {/* English Title */}
            <div className="space-y-2">
              <span className="font-sans-clean text-xs tracking-[0.2em] uppercase text-stone-400 block font-medium">
                Proposed Title
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl text-stone-950 font-medium tracking-tight">
                “{data.titleEnglish}”
              </h3>
            </div>

            {/* English Symbolism */}
            <div className="space-y-3 pt-6 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="font-sans-clean text-sm font-semibold tracking-wide text-stone-800 uppercase">
                  Photographic Symbolism
                </span>
                <span className="text-xs text-stone-400 font-sans-clean">
                  {data.englishWordCount || 0} / 60 words
                </span>
              </div>
              <p className="font-editorial text-xl sm:text-2xl text-stone-800 leading-relaxed font-normal">
                {data.symbolismEnglish}
              </p>
            </div>
          </div>
        )}

        {/* 3. BILINGUAL MODE (INDEPENDENT DIRECTIONALITY: ARABIC RTL & ENGLISH LTR) */}
        {languageMode === 'bilingual' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            {/* Dual Title Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-stone-100">
              {/* Arabic Title (Right-to-Left) */}
              <div dir="rtl" className="text-right space-y-2 arabic-rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
                <span className="font-arabic-heading text-xs tracking-widest text-stone-400 block text-right">
                  العنوان المقترح
                </span>
                <h3 className="font-arabic-art text-2xl sm:text-3xl text-stone-950 font-bold leading-snug text-right">
                  « {data.titleArabic} »
                </h3>
              </div>

              {/* English Title (Left-to-Right) */}
              <div dir="ltr" className="text-left space-y-2 md:border-l md:border-stone-150 md:pl-8">
                <span className="font-sans-clean text-xs tracking-[0.2em] uppercase text-stone-400 block font-medium">
                  Proposed Title
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-stone-950 font-medium">
                  “{data.titleEnglish}”
                </h3>
              </div>
            </div>

            {/* Dual Symbolism Interpretation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Arabic Symbolism (Right-to-Left) */}
              <div dir="rtl" className="text-right space-y-3 arabic-rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
                <div className="flex items-center justify-between text-right" dir="rtl">
                  <span className="font-arabic-heading text-sm font-bold text-stone-900">
                    رمزية الصورة
                  </span>
                  <span className="text-xs text-stone-400 font-sans-clean" dir="ltr">
                    {data.arabicWordCount || 0} / 60 words
                  </span>
                </div>
                <p
                  dir="rtl"
                  className="font-arabic-art text-xl text-stone-800 leading-[2.1] text-right"
                  style={{ direction: 'rtl', textAlign: 'right' }}
                >
                  {data.symbolismArabic}
                </p>
              </div>

              {/* English Symbolism (Left-to-Right) */}
              <div dir="ltr" className="text-left space-y-3 md:border-l md:border-stone-150 md:pl-8">
                <div className="flex items-center justify-between">
                  <span className="font-sans-clean text-xs font-semibold tracking-wide text-stone-800 uppercase">
                    Photographic Symbolism
                  </span>
                  <span className="text-xs text-stone-400 font-sans-clean">
                    {data.englishWordCount || 0} / 60 words
                  </span>
                </div>
                <p className="font-editorial text-lg sm:text-xl text-stone-800 leading-relaxed">
                  {data.symbolismEnglish}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Curatorial Note on Artistic Interpretation */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="mt-12 pt-6 border-t border-stone-100 text-center"
        >
          <p className={`text-xs text-stone-400 max-w-xl mx-auto italic ${isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
            {isArabic
              ? 'تُقدَّم هذه القراءة كتأويل فني ومفاهيمي مستند إلى البنية البصرية للخطوط، والتكوين، وتوزيع الضوء؛ كدعوة للتأمل الجمالي وليست حقيقة موضوعية جازمة.'
              : 'This reading offers a conceptual and artistic perspective based on the visual structure, geometry, and light, presented as an invitation to aesthetic contemplation rather than a dogmatic factual claim.'}
          </p>
        </div>
      </article>

      {/* DOCUMENT EXPORT SECTION */}
      <section
        dir={isArabic ? 'rtl' : 'ltr'}
        className="bg-stone-50 border border-stone-200/80 rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h3 className={`text-lg font-medium text-stone-900 tracking-wider ${isArabic ? 'font-arabic-heading font-bold' : 'font-serif-display'}`}>
              {isArabic ? 'تصدير المستندات والمعارض' : 'Document Export'}
            </h3>
            <p className={`text-xs text-stone-500 mt-0.5 ${isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
              {isArabic
                ? 'تصدير وثائق جاهزة للنشر بصيغتي Word (.docx) و PDF بقياس A4 بدقة عالية وتنسيق RTL كامل للغة العربية.'
                : 'Generate publication-ready Word (.docx) and A4 PDF exhibition catalogs with full RTL/LTR fidelity.'}
            </p>
          </div>
        </div>

        {/* 6 Dedicated Export Buttons (3 Word + 3 PDF) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Word Export Suite */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 text-sm font-semibold">
              <FileText className="w-4 h-4 text-stone-700" />
              <span className={isArabic ? 'font-arabic-heading' : 'font-serif-display'}>
                {isArabic ? 'تصدير مستند Word (.docx)' : 'Microsoft Word (.docx) Export'}
              </span>
            </div>
            <p className={`text-xs text-stone-500 ${isArabic ? 'font-arabic-art' : 'font-sans-clean'}`}>
              {isArabic
                ? 'يتضمن ترويسة معتمدة، واسم د. هشام الخطيب، وتنسيق RTL حقيقي للغة العربية مع تحجيم آمن للصورة.'
                : 'Includes formal header, Dr. Hisham AlKhatib attribution, scaled original photo, and RTL/LTR formatting.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => onExportWord('arabic')}
                disabled={Boolean(isExporting)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                  isArabic
                    ? 'text-white bg-stone-900 hover:bg-stone-800'
                    : 'text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير Word بالعربية' : 'Export Arabic Word'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onExportWord('english')}
                disabled={Boolean(isExporting)}
                className="px-3 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير Word بالإنجليزية' : 'Export English Word'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onExportWord('bilingual')}
                disabled={Boolean(isExporting)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                  isArabic
                    ? 'text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                    : 'text-white bg-stone-900 hover:bg-stone-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير Word ثنائي اللغة' : 'Export Bilingual Word'}
                </span>
              </button>
            </div>
          </div>

          {/* PDF Export Suite */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 text-sm font-semibold">
              <Download className="w-4 h-4 text-stone-700" />
              <span className={isArabic ? 'font-arabic-heading' : 'font-serif-display'}>
                {isArabic ? 'تصدير لوحة فنية PDF (قياس A4)' : 'A4 Fine Art PDF Export'}
              </span>
            </div>
            <p className={`text-xs text-stone-500 ${isArabic ? 'font-arabic-art' : 'font-sans-clean'}`}>
              {isArabic
                ? 'طباعة معرضية عالية الدقة 300DPI، مع الحفاظ الكامل على الحروف والتشكيلات العربية واتجاه RTL.'
                : 'Crisp 300DPI typography, high-grade photo rendering, and perfect Arabic font ligatures.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => onExportPdf('arabic')}
                disabled={Boolean(isExporting)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                  isArabic
                    ? 'text-white bg-stone-900 hover:bg-stone-800'
                    : 'text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير PDF بالعربية' : 'Export Arabic PDF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onExportPdf('english')}
                disabled={Boolean(isExporting)}
                className="px-3 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير PDF بالإنجليزية' : 'Export English PDF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onExportPdf('bilingual')}
                disabled={Boolean(isExporting)}
                className={`px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                  isArabic
                    ? 'text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                    : 'text-white bg-stone-900 hover:bg-stone-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className={isArabic ? 'font-arabic-heading' : 'font-sans-clean'}>
                  {isArabic ? 'تصدير PDF ثنائي اللغة' : 'Export Bilingual PDF'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {isExporting && (
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100 p-2.5 rounded-md animate-pulse">
            <Sparkles className="w-4 h-4 text-stone-700 animate-spin" />
            <span className={isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}>
              {isArabic ? `جاري تجهيز ${isExporting}... بتنسيق عالي الدقة.` : `Generating ${isExporting}... Preparing high-resolution formatting.`}
            </span>
          </div>
        )}
      </section>

      {/* EXPANDABLE 15 ANALYTICAL DIMENSIONS BREAKDOWN */}
      {data.dimensions && (
        <section dir={isArabic ? 'rtl' : 'ltr'} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-stone-600" />
              <div>
                <h4 className={`text-sm font-semibold tracking-wide text-stone-900 ${isArabic ? 'font-arabic-heading' : 'font-serif-display'}`}>
                  {isArabic
                    ? 'تفصيل الأبعاد السيميائية الخمسة عشر'
                    : 'Comprehensive Semiotic & Visual Dimensions Breakdown'}
                </h4>
                <p className={`text-xs text-stone-500 mt-0.5 ${isArabic ? 'font-arabic-art' : 'font-sans-clean'}`}>
                  {isArabic
                    ? 'تحليل تفصيلي للمعايير الفنية الـ 15 التي تمت دراستها بواسطة Gemini Vision'
                    : 'Detailed analysis across the 15 artistic criteria evaluated by Gemini Vision'}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-xs text-stone-500 ${isArabic ? 'font-arabic-heading' : 'font-sans-clean'}`}>
              <span>{showDimensions ? (isArabic ? 'طي الأبعاد' : 'Collapse') : (isArabic ? 'عرض الأبعاد الـ 15' : 'Expand 15 Dimensions')}</span>
              {showDimensions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showDimensions && (
            <div className="px-6 pb-6 pt-2 border-t border-stone-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {dimensionKeys.map(({ key, labelEn, labelAr }) => {
                  const val = (data.dimensions as any)?.[key];
                  if (!val) return null;
                  return (
                    <div
                      key={key}
                      dir={isArabic ? 'rtl' : 'ltr'}
                      className="p-3.5 rounded-lg bg-stone-50 border border-stone-150 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold text-stone-900 ${isArabic ? 'font-arabic-heading' : 'font-sans-clean'}`}>
                          {isArabic ? labelAr : labelEn}
                        </span>
                        <span className={`text-stone-500 ${isArabic ? 'font-sans-clean text-[11px]' : 'font-arabic-heading'}`}>
                          {isArabic ? labelEn : labelAr}
                        </span>
                      </div>
                      <p className={`text-xs text-stone-700 leading-relaxed ${isArabic ? 'font-arabic-art text-sm' : 'font-sans-clean'}`}>
                        {val}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

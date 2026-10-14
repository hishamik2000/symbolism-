import React from 'react';

interface HeaderProps {
  languageMode: 'arabic' | 'english' | 'bilingual';
  onLanguageChange: (mode: 'arabic' | 'english' | 'bilingual') => void;
}

export const Header: React.FC<HeaderProps> = ({ languageMode, onLanguageChange }) => {
  const isArabic = languageMode === 'arabic';

  return (
    <header className="pt-10 pb-8 text-center border-b border-stone-200/80 bg-white/70 backdrop-blur-xs">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* Language Selection Bar at Top Header */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center p-1 bg-stone-100/90 rounded-lg border border-stone-200 text-xs font-sans-clean font-medium">
            <button
              type="button"
              onClick={() => onLanguageChange('arabic')}
              className={`px-3.5 py-1.5 rounded-md transition-all ${
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
              className={`px-3.5 py-1.5 rounded-md transition-all ${
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
              className={`px-3.5 py-1.5 rounded-md transition-all ${
                languageMode === 'english'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* Header Content Based on Language Mode */}
        {isArabic ? (
          <div dir="rtl" className="space-y-4 text-center">
            {/* Main Title Arabic */}
            <h1 className="font-arabic-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-stone-900 leading-tight">
              الرمزية في التصوير الفوتوغرافي
            </h1>

            {/* Author Attribution Arabic */}
            <div className="space-y-1 font-arabic-art text-stone-800">
              <p className="text-2xl sm:text-3xl font-bold text-stone-900">
                د. هشام الخطيب
              </p>
              <div className="flex items-center justify-center gap-3 text-stone-600 font-arabic-heading text-sm tracking-wide">
                <span>استشاري الأشعة التشخيصية</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>مصوّر هاوٍ</span>
              </div>
            </div>

            {/* Mission Statement Arabic */}
            <p className="max-w-2xl mx-auto text-stone-600 text-sm sm:text-base leading-loose font-arabic-art font-normal">
              منصة سيميائية بصرية متخصصة لقراءة الصورة الفوتوغرافية من منظور رمزي، فني ومفاهيمي؛
              لاستنطاق التكوين، وتناغم الضوء والظلال، والأبعاد الهندسية الكامنة وراء المشهد الظاهر.
            </p>
          </div>
        ) : languageMode === 'bilingual' ? (
          <div className="space-y-4 text-center">
            {/* Bilingual Titles */}
            <div className="space-y-1">
              <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-[0.16em] text-stone-900 uppercase">
                Photographic Symbolism
              </h1>
              <h2 dir="rtl" className="font-arabic-heading text-2xl sm:text-3xl font-bold text-stone-800 pt-1">
                الرمزية في التصوير الفوتوغرافي
              </h2>
            </div>

            {/* Bilingual Attribution */}
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-serif-display tracking-wider text-stone-900">
                Dr. Hisham AlKhatib · <span dir="rtl" className="font-arabic-art font-bold text-2xl">د. هشام الخطيب</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-stone-500 font-sans-clean text-xs sm:text-sm tracking-widest uppercase">
                <span>Consultant Radiologist</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Amateur Photographer</span>
                <span aria-hidden="true" className="text-stone-300 hidden sm:inline">|</span>
                <span dir="rtl" className="font-arabic-heading text-xs lowercase normal-case tracking-normal">
                  استشاري الأشعة التشخيصية · مصوّر هاوٍ
                </span>
              </div>
            </div>

            <p className="max-w-2xl mx-auto text-stone-600 text-xs sm:text-sm leading-relaxed font-sans-clean font-light">
              Visual semiotics &amp; fine art photographic interpretation — analyzing conceptual meaning, visual rhythm,
              geometry, and light.
            </p>
          </div>
        ) : (
          <div dir="ltr" className="space-y-4 text-center">
            {/* English Title */}
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-[0.18em] text-stone-900 uppercase">
              Photographic Symbolism
            </h1>

            {/* English Attribution */}
            <div className="space-y-1 font-editorial text-stone-700">
              <p className="text-xl sm:text-2xl font-serif-display tracking-wider text-stone-900">
                Dr. Hisham AlKhatib
              </p>
              <div className="flex items-center justify-center gap-3 text-stone-500 font-sans-clean text-xs sm:text-sm tracking-widest uppercase">
                <span>Consultant Radiologist</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Amateur Photographer</span>
              </div>
            </div>

            <p className="max-w-2xl mx-auto text-stone-600 text-sm sm:text-base leading-relaxed font-sans-clean font-light">
              A dedicated visual semiotics studio analyzing photographs from symbolic, artistic,
              and conceptual viewpoints — reading the silent geometry, light, and visual metaphors beneath the visible surface.
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

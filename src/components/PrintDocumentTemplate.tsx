import React from 'react';
import { AnalysisData } from '../utils/exportUtils';

interface PrintDocumentTemplateProps {
  data: AnalysisData | null;
  image: string | null;
  exportMode: 'arabic' | 'english' | 'bilingual';
}

export const PrintDocumentTemplate: React.FC<PrintDocumentTemplateProps> = ({
  data,
  image,
  exportMode,
}) => {
  if (!data || !image) return null;

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isArabic = exportMode === 'arabic';

  return (
    <div
      aria-hidden="true"
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '794px', // Standard A4 width at 96 DPI
        minHeight: '1123px', // Standard A4 height at 96 DPI
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        padding: '44px 50px',
        boxSizing: 'border-box',
        zIndex: -50,
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
      id="pdf-print-container"
    >
      {/* 1. Header (Strict RTL in Arabic mode) */}
      {exportMode === 'arabic' ? (
        <div style={{ textAlign: 'center', borderBottom: '1px solid #d4d4d4', paddingBottom: '20px', marginBottom: '22px', direction: 'rtl' }}>
          <h1
            style={{
              fontFamily: "'Noto Serif Arabic', 'Amiri', serif",
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111111',
              margin: '0 0 8px 0',
              direction: 'rtl',
            }}
          >
            الرمزية في التصوير الفوتوغرافي
          </h1>
          <h2
            style={{
              fontFamily: "'Amiri', 'Noto Serif Arabic', serif",
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#222222',
              margin: '0 0 4px 0',
              direction: 'rtl',
            }}
          >
            د. هشام الخطيب
          </h2>
          <div
            style={{
              fontFamily: "'Noto Serif Arabic', serif",
              fontSize: '12px',
              color: '#555555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              direction: 'rtl',
            }}
          >
            <span>استشاري الأشعة التشخيصية</span>
            <span>·</span>
            <span>مصوّر هاوٍ</span>
          </div>
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: '11px',
              color: '#888888',
              marginTop: '8px',
              direction: 'rtl',
            }}
          >
            قراءة سيميائية معرضية · {currentDate}
          </div>
        </div>
      ) : exportMode === 'bilingual' ? (
        <div style={{ textAlign: 'center', borderBottom: '1px solid #d4d4d4', paddingBottom: '20px', marginBottom: '22px' }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0 0 4px 0',
            }}
          >
            Photographic Symbolism
          </h1>
          <h2
            dir="rtl"
            style={{
              fontFamily: "'Noto Serif Arabic', serif",
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#222222',
              margin: '0 0 6px 0',
              direction: 'rtl',
            }}
          >
            الرمزية في التصوير الفوتوغرافي
          </h2>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '16px',
              fontWeight: 500,
              color: '#222222',
              margin: '0 0 4px 0',
            }}
          >
            Dr. Hisham AlKhatib · <span dir="rtl" style={{ fontFamily: "'Amiri', serif", fontWeight: 'bold' }}>د. هشام الخطيب</span>
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: '#666666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textTransform: 'uppercase',
            }}
          >
            <span>Consultant Radiologist · Amateur Photographer</span>
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '10px',
              color: '#888888',
              marginTop: '6px',
            }}
          >
            Curatorial Exhibition Reading · {currentDate}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', borderBottom: '1px solid #d4d4d4', paddingBottom: '20px', marginBottom: '22px' }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#111111',
              margin: '0 0 8px 0',
            }}
          >
            Photographic Symbolism
          </h1>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '17px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#222222',
              margin: '0 0 4px 0',
            }}
          >
            Dr. Hisham AlKhatib
          </h2>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#666666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>Consultant Radiologist</span>
            <span>·</span>
            <span>Amateur Photographer</span>
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '10px',
              color: '#888888',
              marginTop: '8px',
            }}
          >
            Curatorial Plate · {currentDate}
          </div>
        </div>
      )}

      {/* 2. Original photograph (centered, scaled safely) */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: '8px',
            backgroundColor: '#fafafa',
            border: '1px solid #e5e5e5',
            borderRadius: '4px',
            display: 'inline-block',
            maxWidth: '100%',
          }}
        >
          <img
            src={image}
            alt="Original photograph"
            style={{
              maxHeight: '430px',
              maxWidth: '650px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* 3. Suggested title & Symbolic interpretation based on exportMode */}

      {/* ARABIC MODE (STRICT RIGHT-TO-LEFT) */}
      {exportMode === 'arabic' && (
        <div dir="rtl" style={{ textAlign: 'right', marginTop: '16px', direction: 'rtl' }}>
          <div style={{ marginBottom: '16px', direction: 'rtl', textAlign: 'right' }}>
            <span
              style={{
                fontFamily: "'Noto Serif Arabic', serif",
                fontSize: '12px',
                color: '#666666',
                display: 'block',
                marginBottom: '4px',
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              العنوان المقترح
            </span>
            <h3
              style={{
                fontFamily: "'Amiri', 'Noto Serif Arabic', serif",
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#111111',
                margin: 0,
                lineHeight: 1.3,
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              « {data.titleArabic} »
            </h3>
          </div>

          <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '16px', direction: 'rtl', textAlign: 'right' }}>
            <span
              style={{
                fontFamily: "'Noto Serif Arabic', serif",
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#333333',
                display: 'block',
                marginBottom: '8px',
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              رمزية الصورة
            </span>
            <p
              style={{
                fontFamily: "'Amiri', 'Noto Serif Arabic', serif",
                fontSize: '19px',
                lineHeight: '2.1',
                color: '#222222',
                margin: 0,
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              {data.symbolismArabic}
            </p>
          </div>
        </div>
      )}

      {/* ENGLISH MODE (STRICT LEFT-TO-RIGHT) */}
      {exportMode === 'english' && (
        <div dir="ltr" style={{ textAlign: 'left', marginTop: '16px', direction: 'ltr' }}>
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Proposed Title
            </span>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                fontWeight: 600,
                color: '#111111',
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              “{data.titleEnglish}”
            </h3>
          </div>

          <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '16px' }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#444444',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Photographic Symbolism
            </span>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                lineHeight: '1.65',
                color: '#222222',
                margin: 0,
              }}
            >
              {data.symbolismEnglish}
            </p>
          </div>
        </div>
      )}

      {/* BILINGUAL MODE */}
      {exportMode === 'bilingual' && (
        <div style={{ marginTop: '16px' }}>
          {/* Dual Titles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e5e5',
            }}
          >
            {/* Arabic Title (Right-to-Left on the right) */}
            <div dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>
              <span
                style={{
                  fontFamily: "'Noto Serif Arabic', serif",
                  fontSize: '11px',
                  color: '#666666',
                  display: 'block',
                  marginBottom: '2px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                العنوان المقترح
              </span>
              <h3
                style={{
                  fontFamily: "'Amiri', 'Noto Serif Arabic', serif",
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#111111',
                  margin: 0,
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                « {data.titleArabic} »
              </h3>
            </div>

            {/* English Title (Left-to-Right on the left) */}
            <div dir="ltr" style={{ textAlign: 'left', borderLeft: '1px solid #eeeeee', paddingLeft: '20px', direction: 'ltr' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666666',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                Proposed Title
              </span>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#111111',
                  margin: 0,
                }}
              >
                “{data.titleEnglish}”
              </h3>
            </div>
          </div>

          {/* Dual Interpretations */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              paddingTop: '16px',
            }}
          >
            {/* Arabic Symbolism (Right-to-Left) */}
            <div dir="rtl" style={{ textAlign: 'right', direction: 'rtl' }}>
              <span
                style={{
                  fontFamily: "'Noto Serif Arabic', serif",
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#444444',
                  display: 'block',
                  marginBottom: '6px',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                رمزية الصورة
              </span>
              <p
                style={{
                  fontFamily: "'Amiri', 'Noto Serif Arabic', serif",
                  fontSize: '15px',
                  lineHeight: '1.9',
                  color: '#222222',
                  margin: 0,
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              >
                {data.symbolismArabic}
              </p>
            </div>

            {/* English Symbolism (Left-to-Right) */}
            <div dir="ltr" style={{ textAlign: 'left', borderLeft: '1px solid #eeeeee', paddingLeft: '20px', direction: 'ltr' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#444444',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Photographic Symbolism
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#222222',
                  margin: 0,
                }}
              >
                {data.symbolismEnglish}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer curatorial note */}
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          marginTop: '36px',
          paddingTop: '14px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          fontFamily: isArabic ? "'Amiri', serif" : "'Plus Jakarta Sans', sans-serif",
          fontSize: isArabic ? '11px' : '9px',
          color: '#999999',
          fontStyle: 'italic',
        }}
      >
        {isArabic
          ? 'الرمزية في التصوير الفوتوغرافي · قراءة سيميائية فنية · د. هشام الخطيب'
          : 'Photographic Symbolism · Fine Art Curatorial Reading · Dr. Hisham AlKhatib'}
      </div>
    </div>
  );
};

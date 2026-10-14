import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  BorderStyle,
} from 'docx';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface AnalysisData {
  titleArabic: string;
  titleEnglish: string;
  symbolismArabic: string;
  symbolismEnglish: string;
  arabicWordCount?: number;
  englishWordCount?: number;
  dimensions?: {
    mainSubject?: string;
    composition?: string;
    linesAndGeometry?: string;
    repetitionAndRhythm?: string;
    lightAndShadow?: string;
    contrast?: string;
    elementRelationships?: string;
    negativeSpace?: string;
    depthAndPerspective?: string;
    reflections?: string;
    movementAndDynamism?: string;
    peopleAndPlace?: string;
    emotionalAndCultural?: string;
    visualSymbols?: string;
    conceptualMeaning?: string;
  };
}

// Convert Base64 data URL to Uint8Array for docx ImageRun
function base64ToUint8Array(base64DataUri: string): Uint8Array {
  const base64String = base64DataUri.includes(',')
    ? base64DataUri.split(',')[1]
    : base64DataUri;
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to get natural dimensions of image from base64
function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 });
    };
    img.src = src;
  });
}

// Universal Arabic font configuration for Microsoft Word (complex script + fallback)
const ARABIC_FONT = {
  name: 'Traditional Arabic',
  cs: 'Traditional Arabic',
  ascii: 'Traditional Arabic',
  hAnsi: 'Traditional Arabic',
};

const ARABIC_LANG = {
  value: 'ar-SA',
  bidirectional: 'ar-SA',
};

/**
 * Generates and downloads a Word (.docx) document
 * with guaranteed native Right-to-Left (RTL) formatting in Microsoft Word.
 */
export async function exportWordDocument(
  mode: 'arabic' | 'english' | 'bilingual',
  data: AnalysisData,
  imageDataUrl: string
): Promise<void> {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const { width: naturalWidth, height: naturalHeight } = await getImageDimensions(imageDataUrl);
  const imageBytes = base64ToUint8Array(imageDataUrl);

  // Calculate scaled dimensions to fit Word page width (max 500pt)
  const maxDisplayWidth = 500;
  const maxDisplayHeight = 390;
  let finalWidth = naturalWidth;
  let finalHeight = naturalHeight;
  const aspectRatio = naturalWidth / naturalHeight;

  if (finalWidth > maxDisplayWidth) {
    finalWidth = maxDisplayWidth;
    finalHeight = Math.round(finalWidth / aspectRatio);
  }
  if (finalHeight > maxDisplayHeight) {
    finalHeight = maxDisplayHeight;
    finalWidth = Math.round(finalHeight * aspectRatio);
  }

  const paragraphs: Paragraph[] = [];

  // =========================================================================
  // 1. MANDATORY DOCUMENT HEADER
  // Every exported document must contain:
  // Photographic Symbolism
  // Dr. Hisham AlKhatib
  // Consultant Radiologist
  // Amateur Photographer
  // =========================================================================

  if (mode === 'arabic') {
    // ARABIC MODE: Header with strict Right-To-Left formatting and Arabic translation
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Photographic Symbolism',
            font: 'Cinzel',
            bold: true,
            size: 32,
            color: '1A1A1A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'الرمزية في التصوير الفوتوغرافي',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 36,
            sizeComplexScript: 36,
            color: '111111',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: 'Dr. Hisham AlKhatib  ·  ',
            font: 'Cinzel',
            size: 22,
            color: '333333',
          }),
          new TextRun({
            text: 'د. هشام الخطيب',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 26,
            sizeComplexScript: 26,
            color: '333333',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: 'Consultant Radiologist  ·  ',
            font: 'Plus Jakarta Sans',
            italics: true,
            size: 18,
            color: '666666',
          }),
          new TextRun({
            text: 'استشاري الأشعة التشخيصية',
            font: ARABIC_FONT,
            size: 22,
            sizeComplexScript: 22,
            color: '555555',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'Amateur Photographer  ·  ',
            font: 'Plus Jakarta Sans',
            italics: true,
            size: 18,
            color: '666666',
          }),
          new TextRun({
            text: 'مصوّر هاوٍ',
            font: ARABIC_FONT,
            size: 22,
            sizeComplexScript: 22,
            color: '555555',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 240 },
        border: {
          bottom: {
            color: 'D4D4D4',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: `قراءة سيميائية معرضية  ·  ${currentDate}`,
            font: ARABIC_FONT,
            size: 20,
            sizeComplexScript: 20,
            color: '888888',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      })
    );
  } else if (mode === 'bilingual') {
    // BILINGUAL MODE: Both English & Arabic header lines
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Photographic Symbolism',
            font: 'Cinzel',
            bold: true,
            size: 32,
            color: '1A1A1A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'الرمزية في التصوير الفوتوغرافي',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 30,
            sizeComplexScript: 30,
            color: '222222',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: 'Dr. Hisham AlKhatib  ·  ',
            font: 'Cinzel',
            size: 22,
            color: '333333',
          }),
          new TextRun({
            text: 'د. هشام الخطيب',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 24,
            sizeComplexScript: 24,
            color: '333333',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: 'Consultant Radiologist  ·  Amateur Photographer',
            font: 'Plus Jakarta Sans',
            italics: true,
            size: 18,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'استشاري الأشعة التشخيصية  ·  مصوّر هاوٍ',
            font: ARABIC_FONT,
            size: 20,
            sizeComplexScript: 20,
            color: '666666',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        border: {
          bottom: {
            color: 'D4D4D4',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: `Curatorial Analysis · ${currentDate}`,
            font: 'Plus Jakarta Sans',
            size: 18,
            color: '888888',
          }),
        ],
      })
    );
  } else {
    // ENGLISH MODE
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'Photographic Symbolism',
            font: 'Cinzel',
            bold: true,
            size: 32,
            color: '1A1A1A',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Dr. Hisham AlKhatib',
            font: 'Cinzel',
            size: 24,
            color: '333333',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: 'Consultant Radiologist',
            font: 'Plus Jakarta Sans',
            italics: true,
            size: 20,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'Amateur Photographer',
            font: 'Plus Jakarta Sans',
            italics: true,
            size: 20,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        border: {
          bottom: {
            color: 'D4D4D4',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: `Curatorial Analysis · ${currentDate}`,
            font: 'Plus Jakarta Sans',
            size: 18,
            color: '888888',
          }),
        ],
      })
    );
  }

  // =========================================================================
  // 2. ORIGINAL PHOTOGRAPH (Centered, scaled safely within margins)
  // =========================================================================
  const imageFormat = imageDataUrl.includes('image/png') ? 'png' : 'jpg';

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 240 },
      children: [
        new ImageRun({
          data: imageBytes,
          type: imageFormat,
          transformation: {
            width: finalWidth,
            height: finalHeight,
          },
        }),
      ],
    })
  );

  // =========================================================================
  // 3. SUGGESTED TITLE & SYMBOLIC INTERPRETATION
  // =========================================================================

  if (mode === 'arabic') {
    // ARABIC VERSION: Strict Right-To-Left formatting across paragraphs & text runs
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 200, after: 80 },
        children: [
          new TextRun({
            text: 'العنوان المقترح',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 24,
            sizeComplexScript: 24,
            color: '666666',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 260 },
        children: [
          new TextRun({
            text: `« ${data.titleArabic} »`,
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 34,
            sizeComplexScript: 34,
            color: '111111',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 160, after: 100 },
        children: [
          new TextRun({
            text: 'رمزية الصورة',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 26,
            sizeComplexScript: 26,
            color: '333333',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 220, line: 380 },
        children: [
          new TextRun({
            text: data.symbolismArabic,
            font: ARABIC_FONT,
            size: 24,
            sizeComplexScript: 24,
            color: '222222',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      })
    );
  } else if (mode === 'english') {
    // ENGLISH VERSION: LTR formatting
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({
            text: 'Proposed Title',
            font: 'Plus Jakarta Sans',
            bold: true,
            size: 22,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `“${data.titleEnglish}”`,
            font: 'Cormorant Garamond',
            bold: true,
            size: 34,
            color: '111111',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 140, after: 100 },
        children: [
          new TextRun({
            text: 'Photographic Symbolism',
            font: 'Plus Jakarta Sans',
            bold: true,
            size: 24,
            color: '444444',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200, line: 360 },
        children: [
          new TextRun({
            text: data.symbolismEnglish,
            font: 'Cormorant Garamond',
            size: 24,
            color: '222222',
          }),
        ],
      })
    );
  } else {
    // BILINGUAL VERSION: RTL for Arabic sections, LTR for English sections
    paragraphs.push(
      // Arabic Title (RTL)
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: 'العنوان المقترح',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 22,
            sizeComplexScript: 22,
            color: '666666',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `« ${data.titleArabic} »`,
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 32,
            sizeComplexScript: 32,
            color: '111111',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      // English Title (LTR)
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 100, after: 60 },
        children: [
          new TextRun({
            text: 'Proposed Title',
            font: 'Plus Jakarta Sans',
            bold: true,
            size: 20,
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `“${data.titleEnglish}”`,
            font: 'Cormorant Garamond',
            bold: true,
            size: 32,
            color: '111111',
          }),
        ],
      }),
      // Divider
      new Paragraph({
        spacing: { before: 100, after: 180 },
        border: {
          bottom: {
            color: 'E5E5E5',
            space: 1,
            style: BorderStyle.DASHED,
            size: 4,
          },
        },
        children: [],
      }),
      // Arabic Symbolism (RTL)
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { before: 100, after: 80 },
        children: [
          new TextRun({
            text: 'رمزية الصورة',
            font: ARABIC_FONT,
            bold: true,
            boldComplexScript: true,
            size: 24,
            sizeComplexScript: 24,
            color: '444444',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 200, line: 360 },
        children: [
          new TextRun({
            text: data.symbolismArabic,
            font: ARABIC_FONT,
            size: 22,
            sizeComplexScript: 22,
            color: '222222',
            rightToLeft: true,
            language: ARABIC_LANG,
          }),
        ],
      }),
      // English Symbolism (LTR)
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 140, after: 80 },
        children: [
          new TextRun({
            text: 'Photographic Symbolism',
            font: 'Plus Jakarta Sans',
            bold: true,
            size: 22,
            color: '444444',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200, line: 340 },
        children: [
          new TextRun({
            text: data.symbolismEnglish,
            font: 'Cormorant Garamond',
            size: 22,
            color: '222222',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1200,
              bottom: 1000,
              left: 1200,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  // Pack docx to blob
  const rawBlob = await Packer.toBlob(doc);

  // =========================================================================
  // DEEP OPENXML POST-PROCESSING VIA JSZIP:
  // Microsoft Word requires <w:bidi/> in <w:sectPr> and <w:bidi/> in <w:docDefaults>
  // for the document to natively open and behave as true Right-To-Left!
  // =========================================================================
  let finalBlob: Blob = rawBlob;

  try {
    const arrayBuffer = await rawBlob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. In word/document.xml: Inject <w:bidi/> into <w:sectPr> for Arabic / Bilingual
    if (mode === 'arabic' || mode === 'bilingual') {
      const docXmlFile = zip.file('word/document.xml');
      if (docXmlFile) {
        let docXml = await docXmlFile.async('text');
        // Ensure <w:bidi/> is inserted inside <w:sectPr>
        docXml = docXml.replace(/<w:sectPr>/g, '<w:sectPr><w:bidi/>');
        zip.file('word/document.xml', docXml);
      }

      // 2. In word/styles.xml: Ensure docDefaults sets RTL and Arabic language
      const stylesXmlFile = zip.file('word/styles.xml');
      if (stylesXmlFile) {
        let stylesXml = await stylesXmlFile.async('text');
        stylesXml = stylesXml.replace(
          /<w:pPrDefault\s*\/>/g,
          '<w:pPrDefault><w:pPr><w:bidi/></w:pPr></w:pPrDefault>'
        );
        stylesXml = stylesXml.replace(
          /<w:rPrDefault\s*\/>/g,
          '<w:rPrDefault><w:rPr><w:rFonts w:ascii="Traditional Arabic" w:cs="Traditional Arabic" w:hAnsi="Traditional Arabic"/><w:lang w:val="ar-SA" w:bidi="ar-SA"/><w:rtl/></w:rPr></w:rPrDefault>'
        );
        zip.file('word/styles.xml', stylesXml);
      }
    }

    finalBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  } catch (postProcessErr) {
    console.warn('Word RTL post-processing warning:', postProcessErr);
    // If post-processing fails, fall back to rawBlob
    finalBlob = rawBlob;
  }

  const url = URL.createObjectURL(finalBlob);
  const a = document.createElement('a');
  a.href = url;
  const modeSuffix = mode.charAt(0).toUpperCase() + mode.slice(1);
  a.download = `Photographic_Symbolism_${modeSuffix}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a professional A4 PDF document
 * with highest practical image quality and accurate RTL/LTR typesetting.
 */
export async function exportPdfDocument(
  elementId: string,
  mode: 'arabic' | 'english' | 'bilingual'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Export printable element not found.');
  }

  // Use html2canvas with scale 2.2 for sharp print clarity
  const canvas = await html2canvas(element, {
    scale: 2.2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const canvasAspect = canvas.width / canvas.height;

  let imgPdfWidth = pdfWidth;
  let imgPdfHeight = pdfWidth / canvasAspect;

  // If the rendered element fits neatly on one page:
  if (imgPdfHeight <= pdfHeight) {
    pdf.addImage(imgData, 'JPEG', 0, 0, imgPdfWidth, imgPdfHeight, undefined, 'FAST');
  } else {
    // Multi-page slicing if content is long
    let position = 0;
    let heightLeft = imgPdfHeight;

    pdf.addImage(imgData, 'JPEG', 0, position, imgPdfWidth, imgPdfHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgPdfWidth, imgPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
  }

  const modeSuffix = mode.charAt(0).toUpperCase() + mode.slice(1);
  pdf.save(`Photographic_Symbolism_${modeSuffix}.pdf`);
}

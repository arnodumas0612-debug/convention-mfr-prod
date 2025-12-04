import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Convention } from '../types/convention';

export const generateConventionPDF = async (
  convention: Convention
): Promise<Uint8Array> => {
  const templatePath = determineTemplatePath(convention.student_class || '');

  const existingPdfBytes = await fetch(templatePath).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  pdfDoc.getPages();

  await pdfDoc.embedFont(StandardFonts.Helvetica);
  await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const determineTemplatePath = (studentClass: string): string => {
  const is4emeOu3eme =
    studentClass.includes('4') ||
    studentClass.includes('3');

  return is4emeOu3eme
    ? '/templates/convention-4eme-3eme.pdf'
    : '/templates/convention-pfmp.pdf';
};

export const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

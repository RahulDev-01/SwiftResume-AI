/**
 * PDF Generation Configuration for SwiftResume AI
 * Configures html2pdf.js for A3 format with clickable links
 */

export const getPdfOptions = (resumeTitle = 'Resume') => {
  return {
    margin: [10, 10, 10, 10], // top, right, bottom, left in mm
    filename: `${resumeTitle.replace(/\s+/g, '_')}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollY: 0,
      scrollX: 0,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', // A4 format: 210mm x 297mm
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['.no-break', '.avoid-break']
    }
  };
};

/**
 * Generates PDF from HTML element
 * @param {HTMLElement} element - The element to convert to PDF
 * @param {string} resumeTitle - Title for the PDF file
 * @returns {Promise} Promise that resolves when PDF is generated
 */
export const generatePdf = async (element, resumeTitle = 'Resume') => {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default;
  
  const options = getPdfOptions(resumeTitle);
  
  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true);
  
  // Ensure all links have proper attributes for PDF
  const links = clonedElement.querySelectorAll('a');
  links.forEach(link => {
    // Ensure href is absolute
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
      link.setAttribute('href', `https://${href}`);
    }
    // Ensure link is clickable in PDF
    link.setAttribute('target', '_blank');
    link.style.color = link.style.color || 'inherit';
    link.style.textDecoration = link.style.textDecoration || 'underline';
  });
  
  return html2pdf()
    .set(options)
    .from(clonedElement)
    .save();
};

/**
 * Validates and formats URL to ensure it has a protocol
 * @param {string} url - URL to validate
 * @returns {string} Formatted URL with protocol
 */
export const ensureProtocol = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

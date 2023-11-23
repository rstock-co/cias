
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from a specified HTML element. The function captures the element as an image using html2canvas,
 * then inserts this image into a PDF created with jsPDF. The image can be scaled to fit the width of the PDF or the entire page.
 * The quality of the image capture can be adjusted, affecting the final file size and clarity of the PDF.
 * 
 * @param {string} elementId The ID of the HTML element to be captured and included in the PDF.
 * @param {string} orientation The orientation of the PDF (e.g., 'landscape', 'portrait').
 * @param {string} pdfSize The size of the PDF (e.g., 'a4', 'letter', 'tabloid').  Letter is 8.5 x 11 inches, tabloid is 11 x 17 inches
 * @param {string} filename The name of the PDF file to be saved (e.g., 'document.pdf').
 * @param {boolean} fitToWidth If true, the image scales to fit the width of the PDF (can be multiple pages). If false, it scales to fit all on one page.
 * @param {float} quality Values > 1 increase quality and file size, while values < 1 decrease them. Can be a decimal.
 */

export const printTableToPDF = (elementId, orientation, pdfSize, filename, fitToWidth = true, quality = 2) => {

  console.log("=== DOWNLOAD PDF ===")
  console.log("elementId: ", elementId);
  console.log("orientation: ", orientation);
  console.log("pdfSize: ", pdfSize);
  console.log("filename: ", filename);
  console.log("fitToWidth: ", fitToWidth);
  console.log("quality: ", quality);
  console.log("====================")

  const element = document.getElementById(elementId);

  html2canvas(element, { scale: quality, useCORS: true }).then((originalCanvas) => {

      const paddingInches = 0.25; // Adjust padding (whitespace thickness around the table) here

      const imgData = originalCanvas.toDataURL('image/png');
      const pdf = new jsPDF(orientation, 'in', pdfSize);
      const imgProps = pdf.getImageProperties(imgData);

      const printableWidthInches = pdf.internal.pageSize.getWidth() - paddingInches;
      const printableHeightInches = pdf.internal.pageSize.getHeight() - paddingInches;

      const imagePixelWidth = imgProps.width;
      const imagePixelHeight = imgProps.height;

      const pixelsPerInch = (fitToWidth) 
        ? imagePixelWidth / printableWidthInches
        : imagePixelHeight / printableHeightInches;
      
      const pixelsPerPage = pixelsPerInch * (fitToWidth ? printableHeightInches : printableWidthInches);

      console.log("=== PDF PROPERTIES ===")
      console.log("printableWidthInches: ", printableWidthInches);
      console.log("printableHeightInches: ", printableHeightInches);
      console.log("imagePixelWidth: ", imagePixelWidth);
      console.log("imagePixelHeight: ", imagePixelHeight);
      console.log("pixelsPerInch: ", pixelsPerInch);
      console.log("pixelsPerPage: ", pixelsPerPage);
      console.log("======================")
      
      let yPos = 0;

      while (yPos < imagePixelHeight) {
        let currentPagePrintHeightPixels = (yPos + pixelsPerPage > imagePixelHeight) ? imagePixelHeight - yPos : pixelsPerPage;

        // Create a new canvas for the current page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imagePixelWidth;
        pageCanvas.height = currentPagePrintHeightPixels;

        // Draw the section of the original canvas onto the page canvas
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(originalCanvas, 0, yPos, imagePixelWidth, currentPagePrintHeightPixels, 0, 0, imagePixelWidth, currentPagePrintHeightPixels);

        // Add the page canvas to the PDF
        const pageCanvasDataUrl = pageCanvas.toDataURL('image/png');
        if (yPos > 0) pdf.addPage();
        pdf.addImage(pageCanvasDataUrl, 'PNG', paddingInches / 2, paddingInches / 2, printableWidthInches, currentPagePrintHeightPixels / pixelsPerInch);

        yPos += currentPagePrintHeightPixels;
    }

    pdf.save(filename);
});

};

// ====================================================================================================

// Official documentation for pdf.addImage function

// imageData	string | HTMLImageElement | HTMLCanvasElement | Uint8Array imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement

// format	{string}	format of file if filetype-recognition fails, e.g. 'JPEG'

// x	number	Coordinate (in units declared at inception of PDF document) against left edge of the page

// y	number	Coordinate (in units declared at inception of PDF document) against upper edge of the page

// width	number	width of the image (in units declared at inception of PDF document)

// height	number	height of the Image (in units declared at inception of PDF document)

// alias	string	alias of the image (if used multiple times)

// compression	string	compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'

// rotation	number	rotation of the image in degrees (0-359)

// ====================================================================================================

// ONLINE PDF RESIZER TOOLS:

// https://www.adobe.com/ca/acrobat/online/compress-pdf.html --> (no limit but need to select LOW compression (biggest file size))
// https://pdfresizer.com/  (100 MB limit)


// STACK OVERFLOW

// https://stackoverflow.com/questions/36472094/how-to-set-image-to-fit-width-of-the-page-using-jspdf



// EXAMPLE USAGE:

// export const printAllocationTable = () => {
//     const element = document.getElementById('allocationTable');
//     const opt = {
//         margin: 1,
//         filename: 'allocation_table.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
//         jsPDF: { unit: 'in', format: 'tabloid', orientation: 'landscape' }
//     };

//     html2pdf().from(element).set(opt).save();
// }

export const copyToClipboard = async (text, handler) => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not available');
      return;
    }
  
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
      handler(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
};


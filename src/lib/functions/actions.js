
import { charityAllocation, teamAllocation } from '../../settings';
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

export const printBlendedTableToPDF = (elementId, orientation, pdfSize, filename, fitToWidth = true, quality = 2) => {

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


// ==========================   LEGACY (print normal single page PDF's - for now)  ====================

export const printTableToPDF = (elementId, orientation, pdfSize, filename, quality = 2) => {

  const element = document.getElementById(elementId);

  html2canvas(element, { scale: quality, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(orientation, 'in', pdfSize);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = imgProps.width / imgProps.height;
      let imgHeight = pdfHeight - 0.5;  // Subtract padding
      let imgWidth = imgHeight * ratio;
      if (imgWidth > pdfWidth - 0.5) {  // Subtract padding
          imgWidth = pdfWidth - 0.5;  // Subtract padding
          imgHeight = imgWidth / ratio;
      }
      pdf.addImage(imgData, 'PNG', 0.25, 0.25, imgWidth, imgHeight);  // Add padding
      pdf.save(filename);
  });
}


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


// STACK OVERFLOW - WHY WE NEED TO KEEP THE SCALE AT 2 TO AVOID GREY SHADING ON THE PDF:

// https://stackoverflow.com/a/63443349


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


export const copyDistributionToClipboard = async (sortedAllocationTableData, totalTokens, walletName) => {
  if (!navigator.clipboard) {
    console.error('Clipboard API not available');
    return;
  }

  const formattedWalletName = walletName.replace("Allocation Table", "Distribution").replace("' Wallet", "");

  // Calculate team and charity fees
  const teamFee = totalTokens * teamAllocation; // 7% for the team
  const charityFee = totalTokens * charityAllocation; // 1% for charity
  const tokensToDistribute = totalTokens - (teamFee + charityFee); // Calculate 92% of total tokens for distribution

  // Prepare title, headers, and summary rows for the team and charity fees
  const titleString = `${formattedWalletName}\n\n`;
  const headerString = "Wallet Address\tTokens\tShare (%)\n";  // // to add member name back in, insert this:     \tMember Name
  const summaryString = `Total # of tokens:\t${Number(totalTokens).toFixed(2)}\nTeam fee:\t${teamFee.toFixed(4)}\nCharity fee:\t${charityFee.toFixed(4)}\n\nTotal # of tokens distributed:\t${tokensToDistribute.toFixed(4)}\n\n`;

  // Serialize tableData to a string format suitable for spreadsheets
  const tableString = sortedAllocationTableData.map(({ memberWallet, share }) => {  // memberName
    const adjustedShare = share * tokensToDistribute; // Calculate the adjusted share for each wallet
    const walletAddress = memberWallet; // Wallet address
    const weightingPercentage = (share).toFixed(8); // Weighting percentage
    return `${walletAddress}\t${adjustedShare.toFixed(4)}\t${weightingPercentage}`; // to add member name back in, insert this:    \t${memberName ? memberName : ""}
  }).join('\n'); // Join each row with a newline character

  // Combine the title, summary information, and the table data
  const finalString = titleString + summaryString + headerString + tableString;

  try {
    await navigator.clipboard.writeText(finalString);
    alert('Distribution data copied to clipboard');
  } catch (err) {
    console.error('Failed to copy distribution data: ', err);
  }
};

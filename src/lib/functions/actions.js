
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printDocument = () => {
    const element = document.getElementById('myTable');

    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('portrait', 'in', 'tabloid');
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
        pdf.save('download.pdf');
    });
}

// import html2pdf from "html2pdf.js";

// export const printDocument = () => {
//     const element = document.getElementById('myTable');
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


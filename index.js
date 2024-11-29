const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function combineReceipts() {
  try {
    // Load the existing PDF containing the half-page receipts
    const pdfBytes = fs.readFileSync('./output_receipt.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Create a new PDF document for the combined receipts
    const newPdfDoc = await PDFDocument.create();

    // Get the total number of pages (half-page receipts)
    const pageCount = pdfDoc.getPageCount();

    // Loop through pages in pairs (two half-pages per A4 page)
    for (let i = 0; i < pageCount; i += 2) {
      // Create a new A4 page (595x842 points)
      const newPage = newPdfDoc.addPage([595, 842]); // A4 page size

      // Copy the current page (first half-page receipt)
      const [page1] = await newPdfDoc.copyPages(pdfDoc, [i]);

      // Get the content stream from page1 and add it to the new page
      const page1Content = page1.getContentStream();
      newPage.drawContentStream(page1Content, { x: 0, y: 421 });

      // If there's a second page (next receipt), copy and place it at the bottom (y=0)
      if (i + 1 < pageCount) {
        const [page2] = await newPdfDoc.copyPages(pdfDoc, [i + 1]);
        const page2Content = page2.getContentStream();

        // Add the content of the second page at the bottom of the A4 page (y=0)
        newPage.drawContentStream(page2Content, { x: 0, y: 0 });
      }
    }

    // Save the final combined PDF
    const pdfBytesOut = await newPdfDoc.save();
    fs.writeFileSync('/home/roel/Downloads/final_combined_receipt.pdf', pdfBytesOut);

    console.log('Receipts successfully combined into an A4-sized PDF.');
  } catch (error) {
    console.error('Error combining receipts:', error);
  }
}

combineReceipts();

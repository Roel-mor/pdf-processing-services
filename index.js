const fs = require('fs');

async function mergeReceipts() {
  try {
    // Dynamically import pdf-merger-js
    const PDFMerger = (await import('pdf-merger-js')).default;

    // Initialize PDFMerger instance
    const merger = new PDFMerger();

    // Path to the input PDF (with half-page receipts)
    const pdfPath = './output_receipt.pdf';

    // Count the number of pages in the input PDF (half-page receipts)
    const { PDFDocument } = require('pdf-lib');
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    // Loop through the PDF and merge pages in pairs
    for (let i = 0; i < totalPages; i += 2) {
      // Add the input PDF to the merger object (merge two pages at a time)
      await merger.add(pdfPath);
    }

    // Save the final combined PDF in the same directory
    await merger.save('./merged_receipt.pdf');

    console.log('Receipts successfully merged into a final PDF.');

  } catch (error) {
    console.error('Error merging receipts:', error);
  }
}

mergeReceipts();

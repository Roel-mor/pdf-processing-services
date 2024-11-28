const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

// Path to your template PDF
const templatePdfPath = '/home/roel/Downloads/repaired.pdf';

const createReceiptsFromTemplate = async (receiptDataArray) => {
  try {
    // Load the existing template PDF
    const existingPdfBytes = fs.readFileSync(templatePdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a form object
    const form = pdfDoc.getForm();

    // Get the size of the original template page (for debugging)
    const templatePage = pdfDoc.getPages()[0];
    const { width, height } = templatePage.getSize();
    console.log(`Template Page Size: Width = ${width}, Height = ${height}`);

    // Start by processing the receipt data array
    for (let i = 0; i < receiptDataArray.length; i++) {
      console.log(`Processing receipt ${i + 1}...`);
      
      // For the first receipt, we don't copy the page. We just fill the existing template page.
      if (i > 0) {
        // Copy the template page for subsequent receipts
        const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [0]);
        pdfDoc.addPage(copiedPage);
      }

      // Access the correct page where we will fill the form
      const page = pdfDoc.getPages()[i]; // This ensures we're working with the correct page

      // Log the page count and process form fields
      console.log(`Page count for receipt ${i + 1}: ${pdfDoc.getPages().length}`);

      const customerNameField = form.getTextField('customerName');
      const billingMonthField = form.getTextField('billingMonth');
      const meterNumberField = form.getTextField('meterNumber');
      const costField = form.getTextField('cost');
      const totalField = form.getTextField('grandTotal');

      // Fill the form fields for the current page
      customerNameField.setText(receiptDataArray[i].customerName);
      billingMonthField.setText(receiptDataArray[i].billingMonth);
      meterNumberField.setText(receiptDataArray[i].meterNumber);
      costField.setText(receiptDataArray[i].cost);
      totalField.setText(receiptDataArray[i].grandTotal);

      console.log(`Filled form for receipt ${i + 1}:`);
      console.log(`Customer Name: ${receiptDataArray[i].customerName}`);
      console.log(`Billing Month: ${receiptDataArray[i].billingMonth}`);
      console.log(`Meter Number: ${receiptDataArray[i].meterNumber}`);
      console.log(`Cost: ${receiptDataArray[i].cost}`);
      console.log(`Grand Total: ${receiptDataArray[i].grandTotal}`);
    }

    // Log the final number of pages before saving
    console.log(`Final page count before saving PDF: ${pdfDoc.getPages().length}`);

    // Save the modified PDF to memory
    const pdfBytes = await pdfDoc.save();

    // Write the final PDF to disk (or send it as a response if this is a web app)
    fs.writeFileSync('output_receipt.pdf', pdfBytes);
    console.log('PDF created successfully with multiple pages!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Example receipt data array with multiple receipts (for 3 customers)
const receiptDataArray = [
  {
    customerName: 'John Doe',
    billingMonth: 'January 2024',
    meterNumber: '12345',
    cost: '$100',
    grandTotal: '$120',
  },
  {
    customerName: 'Jane Smith',
    billingMonth: 'February 2024',
    meterNumber: '67890',
    cost: '$150',
    grandTotal: '$180',
  },
  {
    customerName: 'Alice Johnson',
    billingMonth: 'March 2024',
    meterNumber: '11223',
    cost: '$200',
    grandTotal: '$220',
  }
];

// Run the function to generate the PDF
createReceiptsFromTemplate(receiptDataArray);

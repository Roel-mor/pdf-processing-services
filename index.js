const express = require('express');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const app = express();

// Path to your template PDF
const templatePdfPath = '/home/roel/Downloads/repaired.pdf';

const createReceiptsFromTemplate = async (receiptDataArray) => {
  try {
    // Load the existing template PDF
    const existingPdfBytes = fs.readFileSync(templatePdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Start by processing the receipt data array
    for (let i = 0; i < receiptDataArray.length; i++) {
      console.log(`Processing receipt ${i + 1}...`);

      // For the first receipt, we fill the existing template page
      if (i > 0) {
        // Copy the template page for subsequent receipts
        const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [0]);
        pdfDoc.addPage(copiedPage);
      }

      // Access the correct form fields for the page
      const form = pdfDoc.getForm();
      const customerNameField = form.getTextField('customerName');
      const billingMonthField = form.getTextField('billingMonth');
      const meterNumberField = form.getTextField('meterNumber');
      const costField = form.getTextField('cost');
      const totalField = form.getTextField('grandTotal');

      // Fill the form fields with the data for the current receipt
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

    // Crop each page to keep the bottom half (for the second receipt)
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      // Correct cropping: keep the bottom half, remove the top half
      page.setCropBox(0, height / 2, width, height / 2); // Crop the top half, keep the bottom
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Write the final PDF to disk
    fs.writeFileSync('output_receipt.pdf', pdfBytes);
    console.log('PDF created successfully with multiple pages, each cropped to keep the bottom half!');
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

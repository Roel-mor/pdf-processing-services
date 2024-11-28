const express = require('express');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const app = express();

app.get('/test-pdf', async (req, res) => {
  try {
    // Step 1: Load the existing PDF
    console.log("Loading PDF...");
    const existingPdfBytes = fs.readFileSync('/home/roel/Downloads/repaired.pdf');
    console.log(`PDF loaded, size: ${existingPdfBytes.length} bytes`);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Step 2: Check if PDF has a form and log form fields
    const form = pdfDoc.getForm();
    console.log("Form found. Available fields:");
    const fields = form.getFields();
    fields.forEach(field => {
      console.log(`Field name: ${field.getName()}`);
    });

    // Step 3: Fill a single form field (start with 'CustomerName')
    const customerNameField = form.getTextField('customerName');
    console.log("Filling CustomerName field...");
    customerNameField.setText('John Doe');
    
    // Step 4: Save the modified PDF to memory
    console.log("Saving the PDF...");
    const pdfBytes = await pdfDoc.save();

    // Step 5: Ensure no other responses are sent, force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="test-output.pdf"');
    res.end(pdfBytes);  // End response to avoid any further issues
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Error processing PDF');
  }
});

const port = 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Default to 3000 if no PORT environment variable is set

// Middleware to parse JSON bodies
app.use(express.json());

// Handle GET requests at the root URL (http://localhost:3000/)
app.get('/', (req, res) => {
  res.send('Hello, world!');  // You can customize this response
});

// Sample POST route to receive the data
app.post('/get-pdf', async (req, res) => {
  const receiptData = req.body;  // The incoming JSON data

  // Validate the data format
  if (!receiptData || !Array.isArray(receiptData)) {
    return res.status(400).send('Invalid data format');
  }

  // Map the incoming data to the expected format
  const receiptDataArray = receiptData.map(item => ({
    customerName: item.customerName,
    billingMonth: item.billingMonth,
    meterNumber: item.meterNumber,
    currentReading: item.currentReading,
    previousReading: item.previousReading,
    gallonsConsumed: item.gallonsConsumed,
    cost: item.cost,
    arrears: item.arrears,
    grandTotal: item.grandTotal
  }));

  // Path to your template PDF
  const templatePdfPath = './bvwb2.pdf';

  // Function to create receipts from the template
  const createReceiptsFromTemplate = async (receiptDataArray) => {
    try {
      // Ensure an even number of receipts (add a blank entry if odd number of receipts)
      if (receiptDataArray.length % 2 !== 0) {
        receiptDataArray.push({
          customerName: '',
          billingMonth: '',
          meterNumber: '',
          currentReading: '',
          previousReading: '',
          gallonsConsumed: '',
          cost: '',
          arrears: '',
          grandTotal: ''
        });
      }

      // Load the template PDF
      const templateBytes = fs.readFileSync(templatePdfPath);
      const newPdfDoc = await PDFDocument.create();

      // Format the currency for cost and arrears fields
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      };

      // Loop through the data and fill the form for each pair of receipts
      for (let i = 0; i < receiptDataArray.length / 2; i++) {
        console.log(`Processing receipt pair ${i + 1}...`);

        // Load the template PDF document
        const pdfDoc = await PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();

        // Fill first receipt fields
        form.getTextField('customerName1').setText(String(receiptDataArray[2 * i].customerName));
        form.getTextField('billingMonth1').setText(String(receiptDataArray[2 * i].billingMonth));
        form.getTextField('meterNumber1').setText(String(receiptDataArray[2 * i].meterNumber));
        form.getTextField('currentReading1').setText(String(receiptDataArray[2 * i].currentReading));
        form.getTextField('previousReading1').setText(String(receiptDataArray[2 * i].previousReading));
        form.getTextField('gallonsConsumed1').setText(String(receiptDataArray[2 * i].gallonsConsumed));
        form.getTextField('cost1').setText(formatCurrency(String(receiptDataArray[2 * i].cost)));
        form.getTextField('arrears1').setText(formatCurrency(String(receiptDataArray[2 * i].arrears)));
        form.getTextField('grandTotal1').setText(formatCurrency(String(receiptDataArray[2 * i].grandTotal)));

        // Fill second receipt fields
        form.getTextField('customerName2').setText(String(receiptDataArray[2 * i + 1].customerName));
        form.getTextField('billingMonth2').setText(String(receiptDataArray[2 * i + 1].billingMonth));
        form.getTextField('meterNumber2').setText(String(receiptDataArray[2 * i + 1].meterNumber));
        form.getTextField('currentReading2').setText(String(receiptDataArray[2 * i + 1].currentReading));
        form.getTextField('previousReading2').setText(String(receiptDataArray[2 * i + 1].previousReading));
        form.getTextField('gallonsConsumed2').setText(String(receiptDataArray[2 * i + 1].gallonsConsumed));
        form.getTextField('cost2').setText(formatCurrency(String(receiptDataArray[2 * i + 1].cost)));
        form.getTextField('arrears2').setText(formatCurrency(String(receiptDataArray[2 * i + 1].arrears)));
        form.getTextField('grandTotal2').setText(formatCurrency(String(receiptDataArray[2 * i + 1].grandTotal)));

        form.flatten();  // Flatten the form to make the fields uneditable

        // Copy the template page and add it to the new PDF document
        const [templatePage] = await newPdfDoc.copyPages(pdfDoc, [0]);
        await newPdfDoc.addPage(templatePage);

        console.log(`Filled form for receipt pair ${i + 1}.`);
      }

      // Send the generated PDF to client
      const pdfBytes = await newPdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output_receipt.pdf"'); // Or 'inline' if you want to display it in the browser
    res.send(pdfBytes);
      console.log('PDF created successfully with multiple pages!');

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Generate the PDF using the receipt data
  await createReceiptsFromTemplate(receiptDataArray);

  // Send a success response back to the client once the PDF is created
  res.status(200).send('Data received and processed');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at:${port}`);
});

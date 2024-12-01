const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const templatePdfPath = './bvwb2.pdf';

const createReceiptsFromTemplate = async (receiptDataArray) => {
  try {
    // Ensure even number of receipts by adding a blank entry if odd
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

    const templateBytes = fs.readFileSync(templatePdfPath);
    const newPdfDoc = await PDFDocument.create();

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    for (let i = 0; i < receiptDataArray.length / 2; i++) {
      console.log(`Processing receipt pair ${i + 1}...`);

      const pdfDoc = await PDFDocument.load(templateBytes);
      const form = pdfDoc.getForm();

      // Fill first receipt fields
      form.getTextField('customerName1').setText(receiptDataArray[2 * i].customerName);
      form.getTextField('billingMonth1').setText(receiptDataArray[2 * i].billingMonth);
      form.getTextField('meterNumber1').setText(receiptDataArray[2 * i].meterNumber);
      form.getTextField('currentReading1').setText(receiptDataArray[2 * i].currentReading);
      form.getTextField('previousReading1').setText(receiptDataArray[2 * i].previousReading);
      form.getTextField('gallonsConsumed1').setText(receiptDataArray[2 * i].gallonsConsumed);
      form.getTextField('cost1').setText(formatCurrency(receiptDataArray[2 * i].cost));
      form.getTextField('arrears1').setText(formatCurrency(receiptDataArray[2 * i].arrears));
      form.getTextField('grandTotal1').setText(formatCurrency(receiptDataArray[2 * i].grandTotal));

      // Fill second receipt fields
      form.getTextField('customerName2').setText(receiptDataArray[2 * i + 1].customerName);
      form.getTextField('billingMonth2').setText(receiptDataArray[2 * i + 1].billingMonth);
      form.getTextField('meterNumber2').setText(receiptDataArray[2 * i + 1].meterNumber);
      form.getTextField('currentReading2').setText(receiptDataArray[2 * i + 1].currentReading);
      form.getTextField('previousReading2').setText(receiptDataArray[2 * i + 1].previousReading);
      form.getTextField('gallonsConsumed2').setText(receiptDataArray[2 * i + 1].gallonsConsumed);
      form.getTextField('cost2').setText(formatCurrency(receiptDataArray[2 * i + 1].cost));
      form.getTextField('arrears2').setText(formatCurrency(receiptDataArray[2 * i+1].arrears));
      form.getTextField('grandTotal2').setText(formatCurrency(receiptDataArray[2 * i + 1].grandTotal));

      form.flatten();
      const [templatePage] = await newPdfDoc.copyPages(pdfDoc, [0]);
      await newPdfDoc.addPage(templatePage);

      console.log(`Filled form for receipt pair ${i + 1}.`);
    }

    const pdfBytes = await newPdfDoc.save();
    fs.writeFileSync('./output_receipt.pdf', pdfBytes);
    console.log('PDF created successfully with multiple pages!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Example data (same as before)
const receiptDataArray = [
  {
    customerName: 'Jane Smith',
    billingMonth: 'February 2024',
    meterNumber: '67890',
    currentReading: '452',
    previousReading: '445',
    gallonsConsumed: '1464',
    cost: '150',
    arrears: '1421',
    grandTotal: '180'
  },
  {
    customerName: 'John Doe',
    billingMonth: 'January 2024',
    meterNumber: '12345',
    currentReading: '720',
    previousReading: '700',
    gallonsConsumed: '1240',
    cost: '120',
    arrears: '1441',
    grandTotal: '160'
  },
  {
    customerName: 'Alice Johnson',
    billingMonth: 'March 2024',
    meterNumber: '54321',
    currentReading: '980',
    previousReading: '960',
    gallonsConsumed: '1600',
    cost: '200',
    arrears: '4631',
    grandTotal: '250'
  },
  {
    customerName: 'Bob Williams',
    billingMonth: 'April 2024',
    meterNumber: '67891',
    currentReading: '560',
    previousReading: '540',
    gallonsConsumed: '1500',
    cost: '140',
    arrears: '983621',
    grandTotal: '190'
  },
  {
    customerName: 'Catherine Brown',
    billingMonth: 'May 2024',
    meterNumber: '98765',
    currentReading: '800',
    previousReading: '780',
    gallonsConsumed: '1340',
    cost: '170',
    arrears: '3785',
    grandTotal: '220'
  },
  {
    customerName: 'David Wilson',
    billingMonth: 'June 2024',
    meterNumber: '34567',
    currentReading: '600',
    previousReading: '580',
    gallonsConsumed: '1400',
    cost: '180',
    arrears: '9621',
    grandTotal: '230'
  },
  {
    customerName: 'Emily Davis',
    billingMonth: 'July 2024',
    meterNumber: '23456',
    currentReading: '740',
    previousReading: '720',
    gallonsConsumed: '1220',
    cost: '130',
    arrears: '651',
    grandTotal: '170'
  },
  {
    customerName: 'Frank Miller',
    billingMonth: 'August 2024',
    meterNumber: '11223',
    currentReading: '910',
    previousReading: '890',
    gallonsConsumed: '1480',
    cost: '190',
    arrears: '5346',
    grandTotal: '240'
  },
  {
    customerName: 'Grace Lee',
    billingMonth: 'September 2024',
    meterNumber: '99887',
    currentReading: '670',
    previousReading: '650',
    gallonsConsumed: '1600',
    cost: '210',
    arrears: '35',
    grandTotal: '260'
  },
  {
    customerName: 'Harry Thomas',
    billingMonth: 'October 2024',
    meterNumber: '77654',
    currentReading: '820',
    previousReading: '800',
    gallonsConsumed: '1440',
    cost: '160',
    arrears: '465',
    grandTotal: '210'
  },
  {
    customerName: 'Ivy Martinez',
    billingMonth: 'November 2024',
    meterNumber: '55443',
    currentReading: '590',
    previousReading: '570',
    gallonsConsumed: '1380',
    cost: '150',
    arrears: '142',
    grandTotal: '200'
  }
];


// Generate the PDF
createReceiptsFromTemplate(receiptDataArray);

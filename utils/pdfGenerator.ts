import puppeteer from 'puppeteer';

export interface PDFGenerationOptions {
  title: string;
  content: string;
  filename: string;
}

export async function generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
  const { title, content, filename } = options;
  
  // Create the HTML template for the PDF
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #000;
            background: #fff;
            padding: 40px;
            font-size: 12px;
          }
          
          .document-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #f7931a;
            padding-bottom: 20px;
          }
          
          .document-title {
            font-size: 24px;
            font-weight: 600;
            color: #f7931a;
            margin-bottom: 10px;
          }
          
          .document-meta {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .company-info {
            font-size: 10px;
            color: #666;
            font-weight: 500;
          }
          
          h1 {
            font-size: 20px;
            font-weight: 600;
            color: #f7931a;
            margin: 30px 0 15px 0;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 5px;
          }
          
          h2 {
            font-size: 16px;
            font-weight: 600;
            color: #f7931a;
            margin: 25px 0 12px 0;
          }
          
          h3 {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin: 20px 0 10px 0;
          }
          
          p {
            margin-bottom: 12px;
            text-align: justify;
            color: #333;
          }
          
          ul {
            margin: 12px 0;
            padding-left: 20px;
          }
          
          li {
            margin-bottom: 6px;
            color: #333;
          }
          
          strong {
            font-weight: 600;
            color: #000;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #f7931a;
          }
          
          .legal-notice {
            background: #fff3e0;
            border: 1px solid #f7931a;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
          
          .legal-notice h3 {
            color: #f7931a;
            margin-bottom: 8px;
          }
          
          .risk-box {
            background: #ffebee;
            border: 1px solid #ef4444;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
          }
          
          .risk-box h3 {
            color: #ef4444;
            margin-bottom: 8px;
          }
          
          .definitions-box {
            background: #f8f9fa;
            border: 1px solid #f7931a;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
          }
          
          .definitions-box h3 {
            color: #f7931a;
            margin-bottom: 10px;
          }
          
          .signature-section {
            margin-top: 40px;
            border-top: 2px solid #e5e5e5;
            padding-top: 20px;
          }
          
          .signature-blocks {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
          }
          
          .signature-block {
            width: 48%;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
          }
          
          .signature-block h4 {
            color: #f7931a;
            margin-bottom: 15px;
            text-align: center;
            font-size: 12px;
          }
          
          .signature-line p {
            margin-bottom: 20px;
            font-family: monospace;
            font-size: 10px;
          }
          
          .footer-notice {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e5e5;
            font-size: 10px;
            color: #666;
            font-style: italic;
            text-align: center;
          }
          
          @page {
            margin: 40px;
            size: A4;
          }
          
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <div class="document-header">
          <div class="document-title">${title}</div>
          <div class="document-meta">Effective Date: October 21, 2025</div>
          <div class="company-info">The Bitcoin Corporation LTD (England & Wales, Co. No. 16735102)</div>
        </div>
        
        <div class="document-content">
          ${content}
        </div>
        
        <div class="footer-notice">
          <strong>Legal Document:</strong> This document is legally binding. Consult with qualified legal counsel before execution.
          Generated on ${new Date().toLocaleDateString('en-GB')} by The Bitcoin Corporation LTD.
        </div>
      </body>
    </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        bottom: '40px',
        left: '40px',
        right: '40px'
      }
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
// Simple PDF generator that works in serverless environments
// Since Puppeteer doesn't work well on Vercel, we'll create a simpler approach

export interface SimplePDFOptions {
  title: string;
  content: string;
  filename: string;
}

export function generateSimplePDF(options: SimplePDFOptions): string {
  const { title, content } = options;
  
  // For now, return an HTML page that uses browser's print-to-PDF functionality
  return `
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
    
    h4 {
      font-size: 12px;
      font-weight: 600;
      color: #333;
      margin: 15px 0 8px 0;
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
    
    .payment-details {
      background: #f8f9fa;
      border: 1px solid #f7931a;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
    }
    
    .payment-details p {
      margin-bottom: 8px;
      font-family: monospace;
      font-size: 11px;
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
    
    .no-print {
      background: #f7931a;
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    
    .print-instructions {
      background: #e8f4f8;
      border: 1px solid #2196f3;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    
    @media print {
      .no-print, .print-instructions {
        display: none !important;
      }
      
      body {
        padding: 20px;
      }
      
      @page {
        margin: 40px;
        size: A4;
      }
    }
  </style>
  <script>
    function downloadPDF() {
      window.print();
    }
    
    // Auto-trigger print dialog when page loads
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 1000);
    });
  </script>
</head>
<body>
  <div class="no-print">
    <h2>🤖 PDF Generation Ready</h2>
    <p>Click the button below or use Ctrl+P (Cmd+P on Mac) to save as PDF</p>
    <button onclick="downloadPDF()" style="background: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">Save as PDF</button>
  </div>
  
  <div class="print-instructions no-print">
    <strong>Print Instructions:</strong> In the print dialog, select "Save as PDF" or "Microsoft Print to PDF" as your destination.
  </div>

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
}
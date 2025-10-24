const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper function to add header
function addHeader(doc, title) {
  doc.fontSize(24)
     .fillColor('#f7931a')
     .text(title, 50, 50, { align: 'center' });
  
  doc.fontSize(10)
     .fillColor('#666666')
     .text('The Bitcoin Corporation LTD', 50, 85, { align: 'center' })
     .text('Company No. 16735102 (England & Wales)', 50, 100, { align: 'center' })
     .text('Effective Date: October 21, 2025', 50, 115, { align: 'center' });
  
  doc.moveTo(50, 140)
     .lineTo(550, 140)
     .stroke('#f7931a');
  
  doc.moveDown(2);
  return doc;
}

// Generate Shareholder Agreement PDF
function generateShareholderAgreement() {
  const doc = new PDFDocument();
  const outputPath = path.join(__dirname, '../pdf-contracts/bitcoin-writer-shareholder-agreement.pdf');
  
  doc.pipe(fs.createWriteStream(outputPath));
  
  addHeader(doc, 'bWriter Shareholder Agreement');
  
  doc.fontSize(14)
     .fillColor('#f7931a')
     .text('GOVERNANCE AGREEMENT', 50, 180)
     .fontSize(11)
     .fillColor('#333333')
     .text('This Shareholder Agreement establishes the governance framework for bWriter shareholders and defines rights, obligations, and decision-making processes within the Bitcoin Writer ecosystem.', 50, 210, { align: 'justify' });
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('1. DEFINITIONS')
     .fontSize(11)
     .fillColor('#333333')
     .text('• Company: The Bitcoin Corporation LTD', 50, doc.y + 10)
     .text('• bWriter Shares: Specific class of shares providing Bitcoin Writer platform rights', 50, doc.y + 5)
     .text('• bWriter Shareholder: Any person or entity holding bWriter Shares', 50, doc.y + 5)
     .text('• Voting Rights: Rights to vote on Bitcoin Writer matters proportional to shareholding', 50, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('2. SHARE RIGHTS AND OBLIGATIONS')
     .fontSize(11)
     .fillColor('#333333')
     .text('2.1 Voting Rights: One vote per bWriter share on all Bitcoin Writer platform decisions', 50, doc.y + 10)
     .text('2.2 Revenue Sharing: Pro-rata distribution of Bitcoin Writer platform revenues', 50, doc.y + 5)
     .text('2.3 Information Rights: Access to quarterly Bitcoin Writer financial reports', 50, doc.y + 5)
     .text('2.4 Pre-emption Rights: Right to participate in future bWriter share offerings', 50, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('3. GOVERNANCE STRUCTURE')
     .fontSize(11)
     .fillColor('#333333')
     .text('3.1 Board Representation: bWriter shareholders holding >10% may nominate board observer', 50, doc.y + 10)
     .text('3.2 Major Decisions: Require approval from holders of >50% of bWriter shares', 50, doc.y + 5)
     .text('3.3 Platform Governance: Quarterly voting on Bitcoin Writer feature roadmap', 50, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('4. TRANSFER RESTRICTIONS')
     .fontSize(11)
     .fillColor('#333333')
     .text('4.1 Lock-up Period: 6-month restriction on transfers from investment date', 50, doc.y + 10)
     .text('4.2 Right of First Refusal: Company has first right to purchase shares offered for sale', 50, doc.y + 5)
     .text('4.3 Tag-Along Rights: Minority shareholders may participate in majority sales', 50, doc.y + 5)
     .text('4.4 Drag-Along Rights: Majority can require minority participation in company sale', 50, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('5. DISPUTE RESOLUTION')
     .fontSize(11)
     .fillColor('#333333')
     .text('All disputes shall be resolved through binding arbitration administered by the London Court of International Arbitration (LCIA) in accordance with its rules.', 50, doc.y + 10, { align: 'justify' });
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('6. GOVERNING LAW')
     .fontSize(11)
     .fillColor('#333333')
     .text('This Agreement shall be governed by the laws of England and Wales.', 50, doc.y + 10);
  
  // Add signature section
  doc.addPage();
  doc.fontSize(14)
     .fillColor('#f7931a')
     .text('SIGNATURE PAGE', 50, 50, { align: 'center' });
  
  doc.moveDown(2)
     .fontSize(11)
     .fillColor('#333333')
     .text('THE BITCOIN CORPORATION LTD', 50, 150)
     .text('_________________________________', 50, 180)
     .text('Name: [Director]', 50, 200)
     .text('Title: Director', 50, 215)
     .text('Date: _________________', 50, 230);
  
  doc.text('SHAREHOLDER', 300, 150)
     .text('_________________________________', 300, 180)
     .text('Name: _________________', 300, 200)
     .text('Title: _________________', 300, 215)
     .text('Date: _________________', 300, 230);
  
  doc.end();
  console.log('✅ Generated: bitcoin-writer-shareholder-agreement.pdf');
}

// Generate KYC Compliance PDF
function generateKYCCompliance() {
  const doc = new PDFDocument();
  const outputPath = path.join(__dirname, '../pdf-contracts/bitcoin-writer-kyc-compliance.pdf');
  
  doc.pipe(fs.createWriteStream(outputPath));
  
  addHeader(doc, 'KYC Compliance Requirements');
  
  doc.fontSize(14)
     .fillColor('#f7931a')
     .text('KNOW YOUR CUSTOMER POLICY', 50, 180)
     .fontSize(11)
     .fillColor('#333333')
     .text('This document outlines the KYC requirements for all investors in bWriter Shares in compliance with UK Financial Conduct Authority (FCA) regulations.', 50, 210, { align: 'justify' });
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('1. IDENTITY VERIFICATION REQUIREMENTS')
     .fontSize(11)
     .fillColor('#333333')
     .text('All investors must provide:', 50, doc.y + 10)
     .text('• Government-issued photo ID (passport or driving license)', 70, doc.y + 5)
     .text('• Proof of address dated within last 3 months', 70, doc.y + 5)
     .text('• Tax identification number', 70, doc.y + 5)
     .text('• Source of funds declaration', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('2. SOPHISTICATED INVESTOR CERTIFICATION')
     .fontSize(11)
     .fillColor('#333333')
     .text('Investors must certify they meet one of the following criteria:', 50, doc.y + 10)
     .text('• High net worth individual (>£250,000 annual income or >£1M net assets)', 70, doc.y + 5)
     .text('• Sophisticated investor with investment experience', 70, doc.y + 5)
     .text('• Professional investor regulated by FCA', 70, doc.y + 5)
     .text('• Investment professional for 12+ months', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('3. ENHANCED DUE DILIGENCE')
     .fontSize(11)
     .fillColor('#333333')
     .text('For investments exceeding £50,000:', 50, doc.y + 10)
     .text('• Detailed source of wealth documentation', 70, doc.y + 5)
     .text('• Bank reference letter', 70, doc.y + 5)
     .text('• Professional reference', 70, doc.y + 5)
     .text('• Enhanced background checks', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('4. ONGOING MONITORING')
     .fontSize(11)
     .fillColor('#333333')
     .text('• Annual KYC refresh requirements', 50, doc.y + 10)
     .text('• Transaction monitoring for unusual activity', 50, doc.y + 5)
     .text('• Regular sanctions list screening', 50, doc.y + 5)
     .text('• Change of circumstances reporting obligations', 50, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('5. DATA PROTECTION')
     .fontSize(11)
     .fillColor('#333333')
     .text('All personal data collected is processed in accordance with UK GDPR and stored securely. Data is retained for 7 years after relationship termination as required by regulation.', 50, doc.y + 10, { align: 'justify' });
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('6. COMPLIANCE ATTESTATION')
     .fontSize(11)
     .fillColor('#333333')
     .text('By investing in bWriter Shares, you confirm:', 50, doc.y + 10)
     .text('• All information provided is accurate and complete', 70, doc.y + 5)
     .text('• You will notify us of any material changes', 70, doc.y + 5)
     .text('• You understand the compliance requirements', 70, doc.y + 5)
     .text('• You consent to verification procedures', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('7. CONTACT INFORMATION')
     .fontSize(11)
     .fillColor('#333333')
     .text('For KYC compliance inquiries:', 50, doc.y + 10)
     .text('The Bitcoin Corporation LTD', 70, doc.y + 5)
     .text('Email: info@thebitcoincorporation.website', 70, doc.y + 5)
     .text('Phone: +44 07412 922 288', 70, doc.y + 5)
     .text('Website: https://thebitcoincorporation.website', 70, doc.y + 5);
  
  doc.end();
  console.log('✅ Generated: bitcoin-writer-kyc-compliance.pdf');
}

// Generate AML Compliance PDF
function generateAMLCompliance() {
  const doc = new PDFDocument();
  const outputPath = path.join(__dirname, '../pdf-contracts/bitcoin-writer-aml-compliance.pdf');
  
  doc.pipe(fs.createWriteStream(outputPath));
  
  addHeader(doc, 'AML Compliance Policy');
  
  doc.fontSize(14)
     .fillColor('#f7931a')
     .text('ANTI-MONEY LAUNDERING POLICY', 50, 180)
     .fontSize(11)
     .fillColor('#333333')
     .text('The Bitcoin Corporation LTD maintains a comprehensive anti-money laundering program in compliance with the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017.', 50, 210, { align: 'justify' });
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('1. AML PROGRAM OVERVIEW')
     .fontSize(11)
     .fillColor('#333333')
     .text('Our AML program includes:', 50, doc.y + 10)
     .text('• Risk-based customer due diligence procedures', 70, doc.y + 5)
     .text('• Ongoing transaction monitoring systems', 70, doc.y + 5)
     .text('• Suspicious activity reporting (SAR) protocols', 70, doc.y + 5)
     .text('• Regular staff training and awareness programs', 70, doc.y + 5)
     .text('• Independent compliance testing', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('2. RISK ASSESSMENT')
     .fontSize(11)
     .fillColor('#333333')
     .text('Investment risk categorization:', 50, doc.y + 10)
     .text('• Low Risk: UK residents, verified employment, <£10,000 investment', 70, doc.y + 5)
     .text('• Medium Risk: International investors, £10,000-£50,000 investment', 70, doc.y + 5)
     .text('• High Risk: PEPs, high-risk jurisdictions, >£50,000 investment', 70, doc.y + 5)
     .text('• Prohibited: Sanctioned individuals/entities, shell companies', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('3. TRANSACTION MONITORING')
     .fontSize(11)
     .fillColor('#333333')
     .text('All transactions are monitored for:', 50, doc.y + 10)
     .text('• Unusual patterns or volumes', 70, doc.y + 5)
     .text('• Structuring or layering attempts', 70, doc.y + 5)
     .text('• Geographic risk factors', 70, doc.y + 5)
     .text('• Deviation from expected investor behavior', 70, doc.y + 5)
     .text('• Links to known suspicious activities', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('4. REPORTING OBLIGATIONS')
     .fontSize(11)
     .fillColor('#333333')
     .text('We maintain strict reporting protocols:', 50, doc.y + 10)
     .text('• Suspicious Activity Reports to National Crime Agency', 70, doc.y + 5)
     .text('• Currency Transaction Reports for large transactions', 70, doc.y + 5)
     .text('• International wire transfer reporting', 70, doc.y + 5)
     .text('• Regulatory compliance reporting to FCA', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('5. RECORD KEEPING')
     .fontSize(11)
     .fillColor('#333333')
     .text('Records maintained for 7 years include:', 50, doc.y + 10)
     .text('• Customer identification documents', 70, doc.y + 5)
     .text('• Transaction records and account files', 70, doc.y + 5)
     .text('• Correspondence and communications', 70, doc.y + 5)
     .text('• Risk assessments and monitoring reports', 70, doc.y + 5)
     .text('• Training records and compliance testing', 70, doc.y + 5);
  
  doc.moveDown()
     .fontSize(14)
     .fillColor('#f7931a')
     .text('6. COMPLIANCE OFFICER')
     .fontSize(11)
     .fillColor('#333333')
     .text('Money Laundering Reporting Officer (MLRO):', 50, doc.y + 10)
     .text('The Bitcoin Corporation LTD', 70, doc.y + 5)
     .text('Compliance Department', 70, doc.y + 5)
     .text('Email: info@thebitcoincorporation.website', 70, doc.y + 5)
     .text('Phone: +44 07412 922 288', 70, doc.y + 5);
  
  doc.end();
  console.log('✅ Generated: bitcoin-writer-aml-compliance.pdf');
}

// Generate all PDFs
console.log('Generating PDF documents...\n');
generateShareholderAgreement();
generateKYCCompliance();
generateAMLCompliance();

setTimeout(() => {
  console.log('\n✅ All PDF documents generated successfully!');
  console.log('📁 Location: pdf-contracts/');
}, 2000);
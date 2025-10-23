import { NextRequest, NextResponse } from 'next/server';
import { generateSimplePDF } from '../../../../utils/simplePdfGenerator';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check if PDF file exists
    const pdfPath = path.join(process.cwd(), 'pdf-contracts', 'bitcoin-writer-kyc-compliance.pdf');
    
    if (fs.existsSync(pdfPath)) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="bitcoin-writer-kyc-compliance.pdf"',
          'Cache-Control': 'no-store',
        },
      });
    }
    
    // Fallback to HTML generation if PDF doesn't exist
    const content = `
      <div class="legal-notice">
        <h3>Know Your Customer (KYC) Compliance</h3>
        <p>
          This document outlines the KYC requirements for all investors in bWriter Shares. 
          These procedures are mandatory under UK Financial Conduct Authority (FCA) regulations 
          and international anti-money laundering standards.
        </p>
      </div>

      <h1>1. KYC COMPLIANCE OVERVIEW</h1>
      <h2>1.1 Regulatory Framework</h2>
      <p>
        The Bitcoin Corporation LTD operates under UK Financial Conduct Authority (FCA) regulations 
        and complies with the Money Laundering, Terrorist Financing and Transfer of Funds 
        (Information on the Payer) Regulations 2017. All investors must complete KYC verification 
        before participating in any bWriter Share offering.
      </p>
      <p>
        <strong>Legal Basis:</strong> These requirements are mandated under UK law and international 
        standards including the Financial Action Task Force (FATF) recommendations for customer 
        due diligence in financial services.
      </p>

      <h2>1.2 Verification Requirements</h2>
      <p>All prospective investors must provide the following documentation:</p>
      <ul>
        <li><strong>Identity Verification:</strong> Government-issued photo identification</li>
        <li><strong>Address Verification:</strong> Proof of residential address within 3 months</li>
        <li><strong>Source of Funds:</strong> Documentation demonstrating legitimate fund sources</li>
        <li><strong>Enhanced Due Diligence:</strong> Additional checks for high-risk investors</li>
      </ul>

      <h1>2. REQUIRED DOCUMENTATION</h1>
      <h2>2.1 Primary Identity Documents</h2>
      <p>One of the following government-issued photo identification documents:</p>
      <ul>
        <li>Valid passport (any nationality)</li>
        <li>UK driving licence (full or provisional)</li>
        <li>National identity card (EU/EEA countries)</li>
        <li>UK residence permit or visa</li>
      </ul>

      <h2>2.2 Proof of Address</h2>
      <p>Documents dated within the last 3 months showing current residential address:</p>
      <ul>
        <li>Utility bill (gas, electricity, water, council tax)</li>
        <li>Bank or credit card statement</li>
        <li>Mortgage statement or tenancy agreement</li>
        <li>Government correspondence (HMRC, DVLA, etc.)</li>
      </ul>

      <h2>2.3 Source of Funds Documentation</h2>
      <p>Evidence demonstrating the legitimate source of investment funds:</p>
      <ul>
        <li>Bank statements showing fund accumulation (3-6 months)</li>
        <li>Employment contracts and payslips</li>
        <li>Business ownership documentation</li>
        <li>Investment portfolio statements</li>
        <li>Property sale documentation</li>
        <li>Inheritance or gift documentation</li>
      </ul>

      <h1>3. VERIFICATION PROCESS</h1>
      <h2>3.1 Document Submission</h2>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Requirement</th>
            <th>Timeline</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Submit identity documents</td>
            <td>Before investment</td>
            <td>PDF, JPG, PNG (max 10MB)</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Provide proof of address</td>
            <td>Before investment</td>
            <td>PDF, JPG, PNG (max 10MB)</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Source of funds verification</td>
            <td>Before investment</td>
            <td>PDF documents preferred</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Enhanced due diligence (if required)</td>
            <td>Within 5 business days</td>
            <td>Various formats accepted</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Verification completion</td>
            <td>2-5 business days</td>
            <td>Email confirmation</td>
          </tr>
        </tbody>
      </table>

      <h2>3.2 Enhanced Due Diligence Triggers</h2>
      <p>Enhanced due diligence may be required for:</p>
      <ul>
        <li>Investment amounts exceeding £10,000</li>
        <li>Politically Exposed Persons (PEPs)</li>
        <li>Residents of high-risk jurisdictions</li>
        <li>Complex corporate structures</li>
        <li>Unusual transaction patterns</li>
      </ul>

      <h1>4. INVESTOR CATEGORIES</h1>
      <h2>4.1 Individual Investors</h2>
      <p>
        <strong>Retail Investors:</strong> Standard KYC verification with identity, address, 
        and source of funds documentation. Investment limits may apply under FCA retail 
        investor protection rules.
      </p>
      <p>
        <strong>High Net Worth Individuals:</strong> Enhanced verification including wealth 
        source documentation and additional background checks for investments exceeding 
        regulatory thresholds.
      </p>

      <h2>4.2 Institutional Investors</h2>
      <p>Corporate and institutional investors must provide:</p>
      <ul>
        <li>Certificate of incorporation</li>
        <li>Memorandum and articles of association</li>
        <li>Register of directors and shareholders</li>
        <li>Ultimate beneficial ownership (UBO) documentation</li>
        <li>Authorised signatory documentation</li>
        <li>Financial statements (last 2 years)</li>
      </ul>

      <h1>5. DATA PROTECTION & PRIVACY</h1>
      <h2>5.1 GDPR Compliance</h2>
      <p>
        All personal data collected during KYC verification is processed in accordance with 
        the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. 
        Investors have rights regarding their personal data including access, rectification, 
        and erasure where legally permissible.
      </p>

      <h2>5.2 Data Retention</h2>
      <p>
        KYC documentation is retained for a minimum of 5 years after the business relationship 
        ends, as required by UK anti-money laundering regulations. Data may be retained longer 
        where required by law or for legitimate business purposes.
      </p>

      <h2>5.3 Third-Party Verification</h2>
      <p>
        The Company may use regulated third-party KYC service providers to verify investor 
        documentation. These providers are bound by equivalent data protection standards 
        and confidentiality requirements.
      </p>

      <h1>6. ONGOING MONITORING</h1>
      <h2>6.1 Periodic Reviews</h2>
      <p>
        The Company conducts periodic reviews of investor information to ensure ongoing 
        compliance with KYC requirements. Investors may be required to update their 
        documentation periodically or when circumstances change.
      </p>

      <h2>6.2 Transaction Monitoring</h2>
      <p>
        All transactions are monitored for unusual patterns or suspicious activity in 
        accordance with UK anti-money laundering requirements. Suspicious activities 
        will be reported to the Financial Intelligence Unit as required by law.
      </p>

      <h1>7. NON-COMPLIANCE CONSEQUENCES</h1>
      <h2>7.1 Investment Restrictions</h2>
      <p>
        Failure to complete KYC verification will result in:
      </p>
      <ul>
        <li>Inability to participate in bWriter Share offerings</li>
        <li>Suspension of account access</li>
        <li>Potential termination of business relationship</li>
        <li>Return of investment funds where applicable</li>
      </ul>

      <h2>7.2 Legal Obligations</h2>
      <p>
        The Company is legally obligated to refuse service to individuals who cannot 
        complete satisfactory KYC verification. This protects both the Company and 
        legitimate investors from financial crime risks.
      </p>

      <h1>8. CONTACT INFORMATION</h1>
      <h2>8.1 KYC Support</h2>
      <p>
        For questions regarding KYC requirements or assistance with documentation:
      </p>
      <div class="payment-details">
        <p><strong>Email:</strong> kyc@bitcoin-corporation.com</p>
        <p><strong>Phone:</strong> Available upon request</p>
        <p><strong>Address:</strong> The Bitcoin Corporation LTD</p>
        <p><strong>Company No.:</strong> 16735102</p>
        <p><strong>Registered Office:</strong> England & Wales</p>
      </div>

      <h2>8.2 Complaints Procedure</h2>
      <p>
        Investors who wish to raise concerns about the KYC process may submit complaints 
        through our formal complaints procedure. Unresolved complaints may be escalated 
        to the Financial Ombudsman Service.
      </p>

      <div class="signature-section">
        <h2>ACKNOWLEDGMENT</h2>
        <p>
          This KYC Compliance document outlines mandatory requirements for all investors. 
          Completion of KYC verification is a prerequisite for participation in any 
          bWriter Share offering.
        </p>
        
        <div class="signature-blocks">
          <div class="signature-block">
            <h4>THE BITCOIN CORPORATION LTD</h4>
            <div class="signature-line">
              <p>By: _________________________________</p>
              <p>Name: [Compliance Officer]</p>
              <p>Title: Compliance Officer</p>
              <p>Date: _________________________________</p>
            </div>
          </div>

          <div class="signature-block">
            <h4>INVESTOR ACKNOWLEDGMENT</h4>
            <div class="signature-line">
              <p>I acknowledge receipt and understanding of KYC requirements:</p>
              <p>Signature: _________________________________</p>
              <p>Print Name: _________________________________</p>
              <p>Date: _________________________________</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const htmlContent = generateSimplePDF({
      title: 'KYC Compliance Requirements',
      content,
      filename: 'bitcoin-writer-kyc-compliance.pdf'
    });

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating KYC compliance PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
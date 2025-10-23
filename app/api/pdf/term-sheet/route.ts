import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const pdfPath = path.join(process.cwd(), 'pdf-contracts', 'bitcoin-writer-term-sheet.pdf');
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="bitcoin-writer-term-sheet.pdf"',
        'Cache-Control': 'no-store',
      },
    });
    
    /* Original HTML generation code - kept for reference
    const content = `
      <h1>Investment Term Sheet</h1>
      <p><strong>Effective Date:</strong> October 21, 2025</p>
      <p><strong>Company:</strong> The Bitcoin Corporation LTD</p>

      <h2>Key Investment Terms Summary</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Company:</strong></td>
            <td>The Bitcoin Corporation LTD (England & Wales, Co. No. 16735102)</td>
          </tr>
          <tr>
            <td><strong>Security Type:</strong></td>
            <td>bWriter Shares</td>
          </tr>
          <tr>
            <td><strong>Share Class:</strong></td>
            <td>bWriter Shares (product-specific voting rights)</td>
          </tr>
          <tr>
            <td><strong>Total Authorized bWriter Shares:</strong></td>
            <td>1,000,000,000 bWriter shares</td>
          </tr>
          <tr>
            <td><strong>Founder Ownership:</strong></td>
            <td>90% (900,000,000 bWriter shares to @b0ase)</td>
          </tr>
          <tr>
            <td><strong>Offering:</strong></td>
            <td>10% (100,000,000 bWriter shares) for $10,000</td>
          </tr>
          <tr>
            <td><strong>Post-Money Valuation:</strong></td>
            <td>$100,000 USD</td>
          </tr>
        </tbody>
      </table>

      <h1>1. OFFERING OVERVIEW</h1>
      <h2>1.1 bWriter Share Offering Structure</h2>
      <p>
        The Bitcoin Corporation LTD is conducting a private placement of bWriter Shares to 
        qualified investors. This seed round offers 10% of bWriter Shares (100,000,000 shares) at $0.0001 per share, 
        raising a total of $10,000 for Bitcoin Writer platform development and operations.
      </p>
      <p>
        <strong>Share Class Definition:</strong> bWriter Shares represent a specific class of shares in 
        The Bitcoin Corporation LTD that provide rights related to the Bitcoin Writer platform. 
        The Bitcoin Corporation LTD may issue other share classes for other products, but bWriter Shares 
        are specifically tied to Bitcoin Writer's performance and governance.
      </p>

      <h2>1.2 Use of Proceeds</h2>
      <p>Funds raised will be allocated as follows:</p>
      <ul>
        <li>40% - Platform development and technology enhancement</li>
        <li>25% - Marketing and user acquisition</li>
        <li>20% - Operations and team expansion</li>
        <li>10% - Legal and compliance</li>
        <li>5% - Reserve fund</li>
      </ul>

      <h1>2. bWRITER SHARE OFFERING STRUCTURE</h1>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Price per Share</th>
            <th>Equity Percentage</th>
            <th>Total Shares</th>
            <th>Total Raise</th>
            <th>Minimum Investment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Seed Round (Tranche 1)</td>
            <td>$0.0001 USD</td>
            <td>10%</td>
            <td>100,000,000 bWriter shares</td>
            <td>$10,000 USD</td>
            <td>$250 USD</td>
          </tr>
          <tr>
            <td>Future Rounds</td>
            <td>TBD</td>
            <td>TBD</td>
            <td>TBD</td>
            <td>TBD</td>
            <td>TBD</td>
          </tr>
        </tbody>
      </table>
      
      <h2>2.1 bWriter Share Structure</h2>
      <p>The Company has authorized 1,000,000,000 bWriter Shares with the following allocation:</p>
      <ul>
        <li><strong>Founder (b0ase):</strong> 900,000,000 bWriter shares (90%)</li>
        <li><strong>Seed Round Tranche 1:</strong> 100,000,000 bWriter shares (10%) - $10,000 total</li>
        <li><strong>Share Price:</strong> $0.0001 per bWriter share (1/100th of a penny)</li>
      </ul>

      <h1>3. bWRITER SHAREHOLDER RIGHTS AND GOVERNANCE</h1>
      <h2>3.1 bWriter Share Rights</h2>
      <p>bWriter shareholders receive the following rights specific to the Bitcoin Writer platform:</p>
      <ul>
        <li><strong>Revenue Sharing:</strong> Pro-rata distribution of Bitcoin Writer platform revenue</li>
        <li><strong>Voting Rights:</strong> One vote per bWriter share on Bitcoin Writer governance matters</li>
        <li><strong>Information Rights:</strong> Access to Bitcoin Writer financial statements and metrics</li>
        <li><strong>Pre-emption Rights:</strong> Right to participate in future bWriter share rounds</li>
        <li><strong>Platform Rights:</strong> Priority access to Bitcoin Writer premium features</li>
      </ul>

      <h2>3.2 Bitcoin Writer Governance Structure</h2>
      <p>
        bWriter shareholders participate in Bitcoin Writer platform governance under English company law. 
        Major platform decisions require bWriter shareholder approval, with voting power proportional 
        to bWriter shareholding percentage. This includes platform features, revenue distribution, 
        and strategic partnerships specific to Bitcoin Writer.
      </p>

      <h1>4. VESTING AND TRANSFER RESTRICTIONS</h1>
      <table>
        <thead>
          <tr>
            <th>Stakeholder</th>
            <th>Vesting Period</th>
            <th>Cliff Period</th>
            <th>Release Schedule</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Founders</td>
            <td>48 months</td>
            <td>12 months</td>
            <td>Monthly after cliff</td>
          </tr>
          <tr>
            <td>Team</td>
            <td>36 months</td>
            <td>6 months</td>
            <td>Monthly after cliff</td>
          </tr>
          <tr>
            <td>Seed Investors</td>
            <td>24 months</td>
            <td>6 months</td>
            <td>Quarterly after cliff</td>
          </tr>
          <tr>
            <td>Series A Investors</td>
            <td>18 months</td>
            <td>3 months</td>
            <td>Quarterly after cliff</td>
          </tr>
          <tr>
            <td>Public Sale</td>
            <td>No vesting</td>
            <td>N/A</td>
            <td>Immediate</td>
          </tr>
        </tbody>
      </table>

      <h1>5. RISK FACTORS</h1>
      <h2>5.1 Investment Risks</h2>
      <p>Potential investors should carefully consider the following risk factors:</p>
      <ul>
        <li><strong>Early Stage Risk:</strong> Bitcoin Writer is in early development stages</li>
        <li><strong>Market Risk:</strong> Competitive landscape and market adoption uncertainty</li>
        <li><strong>Technology Risk:</strong> Blockchain and platform technology risks</li>
        <li><strong>Regulatory Risk:</strong> Evolving cryptocurrency and securities regulations</li>
        <li><strong>Liquidity Risk:</strong> Limited secondary market for bWriter shares</li>
        <li><strong>Operational Risk:</strong> Dependence on key personnel and technology</li>
      </ul>

      <h1>6. PAYMENT INFORMATION</h1>
      <h2>6.1 Bank Transfer Details (GBP/USD)</h2>
      <div class="payment-details">
        <p><strong>Account Name:</strong> The Bitcoin Corporation LTD</p>
        <p><strong>Bank Name:</strong> ClearBank</p>
        <p><strong>Account Number:</strong> 28694165</p>
        <p><strong>Sort Code:</strong> 04-06-05</p>
        <p><strong>SWIFT/BIC:</strong> CLRBGB22</p>
        <p><strong>IBAN:</strong> GB02 CLRB 0406 0528 6941 65</p>
        <p><strong>Reference:</strong> BWRITER-INVESTMENT</p>
      </div>
      
      <h2>6.2 BSV Payment Details</h2>
      <div class="payment-details">
        <p><strong>BSV Address:</strong> 1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6</p>
        <p><strong>Network:</strong> Bitcoin SV (BSV)</p>
        <p><strong>Address Type:</strong> $bWriter Treasury (accepts BSV, MNEE, Ordinals, $bWriter)</p>
        <p><strong>Memo:</strong> BWRITER-INVESTMENT</p>
      </div>

      <h1>7. CONDITIONS PRECEDENT</h1>
      <h2>7.1 Closing Conditions</h2>
      <p>The closing of this investment round is subject to:</p>
      <ul>
        <li>Completion of due diligence by investors</li>
        <li>Execution of definitive legal agreements</li>
        <li>Completion of KYC/AML compliance procedures</li>
        <li>Legal counsel review and approval</li>
        <li>Regulatory compliance verification</li>
      </ul>

      <h1>7. PROFESSIONAL ADVISORS</h1>
      <h2>7.1 Legal Counsel</h2>
      <p>
        <strong>Company Legal Counsel:</strong> TBD<br>
        <strong>Investor Legal Counsel:</strong> Each investor responsible for own counsel
      </p>

      <h2>7.2 Financial Advisors</h2>
      <p>
        <strong>Company Financial Advisor:</strong> TBD<br>
        <strong>Auditors:</strong> TBD
      </p>

      <h1>8. CONFIDENTIALITY</h1>
      <p>
        This Term Sheet contains confidential and proprietary information. Recipients agree to 
        maintain confidentiality and use the information solely for evaluation purposes. 
        Any reproduction or distribution requires written consent from The Bitcoin Corporation LTD.
      </p>

      <div class="signature-section">
        <h2>ACKNOWLEDGMENT</h2>
        <p>
          This Term Sheet represents a summary of principal terms and is not a binding agreement. 
          Binding obligations will arise only upon execution of definitive legal agreements.
        </p>
        
        <div class="signature-blocks">
          <div class="signature-block">
            <h4>THE BITCOIN CORPORATION LTD</h4>
            <div class="signature-line">
              <p>By: _________________________________</p>
              <p>Name: [Director]</p>
              <p>Title: Director</p>
              <p>Date: _________________________________</p>
            </div>
          </div>

          <div class="signature-block">
            <h4>INVESTOR</h4>
            <div class="signature-line">
              <p>Signature: _________________________________</p>
              <p>Print Name: _________________________________</p>
              <p>Date: _________________________________</p>
            </div>
          </div>
        </div>
      </div>
    `;
    */
  } catch (error) {
    console.error('Error generating term sheet PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
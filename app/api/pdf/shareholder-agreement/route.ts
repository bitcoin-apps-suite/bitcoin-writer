import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '../../../../utils/pdfGenerator';

export async function GET(request: NextRequest) {
  try {
    const content = `
      <div class="legal-notice">
        <h3>Governance Agreement</h3>
        <p>
          This Shareholder Agreement establishes the governance framework for bWriter shareholders 
          and defines rights, obligations, and decision-making processes within the Bitcoin Writer ecosystem.
        </p>
      </div>

      <h1>1. DEFINITIONS</h1>
      <dl>
        <dt><strong>Company</strong></dt>
        <dd>The Bitcoin Corporation LTD, a company incorporated in England and Wales (Company No. 16735102)</dd>
        
        <dt><strong>bWriter Shares</strong></dt>
        <dd>A specific class of shares in The Bitcoin Corporation LTD that provide rights related to the Bitcoin Writer platform</dd>
        
        <dt><strong>bWriter Shareholder</strong></dt>
        <dd>Any person or entity holding bWriter Shares in the Company</dd>
        
        <dt><strong>Board</strong></dt>
        <dd>Board of Directors of The Bitcoin Corporation LTD</dd>
        
        <dt><strong>Voting Rights</strong></dt>
        <dd>Rights to vote on Bitcoin Writer platform matters proportional to bWriter shareholding</dd>
        
        <dt><strong>Revenue Distribution</strong></dt>
        <dd>Distribution of Bitcoin Writer platform profits to bWriter shareholders as declared by the Board</dd>
      </dl>

      <h1>2. GOVERNANCE STRUCTURE</h1>
      <h2>2.1 Bitcoin Writer Platform Governance</h2>
      <p>
        The Company operates under standard English company law governance structures. 
        bWriter shareholders participate in Bitcoin Writer platform governance through voting at 
        platform-specific meetings and through elected representation on platform advisory committees.
      </p>

      <h2>2.2 bWriter Voting Rights</h2>
      <p>bWriter shareholders receive voting rights proportional to their shareholding according to the following structure:</p>
      <ul>
        <li>1 bWriter share = 1 vote on Bitcoin Writer platform resolutions</li>
        <li>Minimum holding of 1% of bWriter shares required to submit platform resolutions</li>
        <li>Voting by proxy permitted with proper authorization</li>
        <li>Special platform resolutions require 75% majority vote of bWriter shareholders</li>
      </ul>

      <h2>2.3 Bitcoin Writer Governance Proposals</h2>
      <p>bWriter shareholders may vote on the following categories of Bitcoin Writer platform proposals:</p>
      <table>
        <thead>
          <tr>
            <th>Proposal Type</th>
            <th>Approval Threshold</th>
            <th>Quorum Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Platform Features</td>
            <td>Simple Majority (51%)</td>
            <td>15% of total supply</td>
          </tr>
          <tr>
            <td>Fee Structure Changes</td>
            <td>Supermajority (67%)</td>
            <td>25% of total supply</td>
          </tr>
          <tr>
            <td>Revenue Distribution</td>
            <td>Supermajority (67%)</td>
            <td>30% of total supply</td>
          </tr>
          <tr>
            <td>Constitutional Changes</td>
            <td>Special Majority (75%)</td>
            <td>40% of total supply</td>
          </tr>
        </tbody>
      </table>

      <h1>3. bWRITER SHAREHOLDER RIGHTS</h1>
      <h2>3.1 Economic Rights</h2>
      <p>bWriter shareholders are entitled to the following economic benefits from the Bitcoin Writer platform:</p>
      <ul>
        <li><strong>Revenue Sharing:</strong> Quarterly distribution of 25% of net Bitcoin Writer platform revenue</li>
        <li><strong>Platform Benefits:</strong> Priority access to Bitcoin Writer premium features and services</li>
        <li><strong>Fee Discounts:</strong> Reduced transaction fees for Bitcoin Writer platform usage</li>
        <li><strong>Premium Support:</strong> Enhanced customer support and platform access</li>
      </ul>

      <h2>3.2 Information Rights</h2>
      <p>bWriter shareholders holding 1% or more of outstanding bWriter shares are entitled to:</p>
      <ul>
        <li>Quarterly Bitcoin Writer financial reports and platform metrics</li>
        <li>Annual audited financial statements related to Bitcoin Writer operations</li>
        <li>Access to platform advisory committee meeting minutes (non-confidential portions)</li>
        <li>Material contract and partnership information affecting Bitcoin Writer</li>
        <li>Bitcoin Writer technology roadmap and development updates</li>
      </ul>

      <h2>3.3 Inspection Rights</h2>
      <p>
        Major bWriter shareholders (5% or more) may inspect Company books and records related to 
        Bitcoin Writer operations upon reasonable notice and for proper business purposes, 
        subject to confidentiality agreements.
      </p>

      <h1>4. bWRITER SHARE TRANSFER RESTRICTIONS</h1>
      <h2>4.1 General Transfer Rights</h2>
      <p>
        bWriter shares are generally transferable subject to applicable securities laws and 
        the restrictions outlined in this Agreement. Transfers must comply with English company law 
        and may be subject to board approval for certain transactions.
      </p>

      <h2>4.2 Restricted Transfers</h2>
      <p>The following transfers are subject to additional restrictions:</p>
      <ul>
        <li>Transfers to competitors or conflicting business interests</li>
        <li>Transfers exceeding 5% of total supply in a single transaction</li>
        <li>Transfers to sanctioned individuals or entities</li>
        <li>Transfers during lock-up periods (as defined in vesting schedules)</li>
      </ul>

      <h2>4.3 Right of First Refusal</h2>
      <p>
        For transfers of 1% or more of outstanding bWriter shares, the Company and existing shareholders 
        maintain a right of first refusal to purchase the shares on the same terms as offered 
        to third parties.
      </p>

      <h1>5. BOARD REPRESENTATION</h1>
      <h2>5.1 bWriter Shareholder Representatives</h2>
      <p>
        bWriter shareholders collectively holding 10% or more of outstanding bWriter shares may nominate 
        one representative to serve as an observer to the Company's Board of Directors for 
        Bitcoin Writer platform matters.
      </p>

      <h2>5.2 Advisory Roles</h2>
      <p>
        Large bWriter shareholders may be invited to participate in advisory committees for:
      </p>
      <ul>
        <li>Bitcoin Writer technology and product development</li>
        <li>Business development and partnerships</li>
        <li>Platform governance evolution</li>
        <li>Risk management and compliance</li>
      </ul>

      <h1>6. REVENUE DISTRIBUTION</h1>
      <h2>6.1 Distribution Schedule</h2>
      <p>
        Revenue distributions to bWriter shareholders occur quarterly, typically within 45 days 
        of each quarter end. Distributions are calculated based on:
      </p>
      <ul>
        <li>Net Bitcoin Writer platform revenue (gross revenue minus operating expenses)</li>
        <li>25% allocation to bWriter shareholder distributions</li>
        <li>Pro-rata distribution based on bWriter share holdings</li>
        <li>Minimum distribution threshold of $100,000 per quarter</li>
      </ul>

      <h2>6.2 Distribution Method</h2>
      <p>
        Distributions are made in BSV or GBP at the Company's discretion, 
        directly to bWriter shareholders via bank transfer or BSV wallet addresses.
      </p>

      <h1>7. PROTECTIVE PROVISIONS</h1>
      <h2>7.1 Supermajority Approval Required</h2>
      <p>The following actions require approval of 67% of outstanding bWriter shares:</p>
      <ul>
        <li>Issuance of additional bWriter shares beyond approved allocation</li>
        <li>Material changes to revenue sharing percentage</li>
        <li>Sale of Bitcoin Writer platform or substantially all platform assets</li>
        <li>Changes to core platform governance mechanisms</li>
        <li>Dissolution of Bitcoin Writer operations</li>
      </ul>

      <h2>7.2 Veto Rights</h2>
      <p>
        bWriter shareholders collectively holding 25% or more may veto certain actions that 
        materially affect bWriter shareholder rights or Bitcoin Writer platform governance structure.
      </p>

      <h1>8. DISPUTE RESOLUTION</h1>
      <h2>8.1 Governance Disputes</h2>
      <p>
        Disputes related to governance proposals or voting outcomes shall be resolved through 
        the platform's built-in dispute resolution mechanisms, including:
      </p>
      <ul>
        <li>Community mediation and discussion forums</li>
        <li>Appeals process for contested votes</li>
        <li>Independent arbitration for material disputes</li>
      </ul>

      <h2>8.2 Legal Disputes</h2>
      <p>
        Other disputes shall be resolved through binding arbitration under English Arbitration Rules, 
        with proceedings conducted in England.
      </p>

      <h1>9. AMENDMENT AND TERMINATION</h1>
      <h2>9.1 Agreement Amendments</h2>
      <p>
        This Agreement may be amended with the approval of 75% of outstanding bWriter shareholders, 
        provided that amendments do not materially impair existing bWriter shareholder rights 
        without individual consent.
      </p>

      <h2>9.2 Termination Events</h2>
      <p>This Agreement terminates upon:</p>
      <ul>
        <li>Dissolution of the Company</li>
        <li>Sale of all Bitcoin Writer platform assets</li>
        <li>Unanimous consent of all bWriter shareholders</li>
        <li>Court order or regulatory requirement</li>
      </ul>

      <div class="signature-section">
        <h2>SIGNATURE PAGE</h2>
        <p>
          By executing this Agreement, the parties acknowledge that they have read, understood, and 
          agree to be bound by all terms and conditions contained herein.
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
            <h4>bWRITER SHAREHOLDER</h4>
            <div class="signature-line">
              <p>Signature: _________________________________</p>
              <p>Print Name: _________________________________</p>
              <p>Date: _________________________________</p>
            </div>
          </div>
        </div>
      </div>

      <div class="legal-notice">
        <p>
          <strong>Legal Disclaimer:</strong> This Shareholder Agreement is a binding legal contract. 
          bWriter shareholders should consult with qualified legal counsel before accepting these terms. 
          Governance participation is voluntary but subject to these binding provisions.
        </p>
      </div>
    `;

    const pdfBuffer = await generatePDF({
      title: 'bWriter Shareholder Agreement',
      content,
      filename: 'bitcoin-writer-shareholder-agreement.pdf'
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="bitcoin-writer-shareholder-agreement.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating shareholder agreement PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
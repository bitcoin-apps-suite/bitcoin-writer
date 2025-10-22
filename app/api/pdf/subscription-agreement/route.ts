import { NextRequest, NextResponse } from 'next/server';
import { generateSimplePDF } from '../../../../utils/simplePdfGenerator';

export async function GET(request: NextRequest) {
  try {
    const content = `
      <div class="legal-notice">
        <h3>Important Legal Notice</h3>
        <p>
          This Subscription Agreement contains legally binding terms and conditions. Please read carefully 
          and consult with qualified legal and financial advisors before proceeding with any investment.
        </p>
      </div>

      <h1>1. PARTIES</h1>
      <p>
        This Subscription Agreement ("Agreement") is entered into between <strong>The Bitcoin Corporation LTD</strong>, 
        a company incorporated in England and Wales with company number 16735102 ("Company"), and the individual or entity 
        executing this Agreement ("Subscriber" or "Investor").
      </p>

      <h1>2. SUBSCRIPTION FOR bWRITER SHARES</h1>
      <h2>2.1 bWriter Share Subscription</h2>
      <p>
        Subject to the terms and conditions of this Agreement, the Subscriber hereby subscribes for 
        and agrees to purchase bWriter Shares ("bWriter Shares") from the Company at $0.0001 per share 
        in accordance with the pricing and allocation terms set forth in the Term Sheet.
      </p>
      <p>
        <strong>Share Class Definition:</strong> bWriter Shares represent a specific class of shares in 
        The Bitcoin Corporation LTD that provide rights related to the Bitcoin Writer platform, including 
        revenue sharing, governance participation, and platform-specific benefits.
      </p>
      
      <h2>2.2 Purchase Price</h2>
      <p>
        The purchase price for the bWriter Shares is $0.0001 per share as outlined in the Term Sheet. 
        Payment shall be made in GBP, USD, or Bitcoin SV (BSV) as specified by the Company. 
        Minimum investment is $250 USD (2,500,000 bWriter shares).
      </p>

      <h2>2.3 Payment Terms</h2>
      <p>
        Payment must be made in full upon execution of this Agreement via bank transfer to the Company's 
        designated account or BSV wallet address. bWriter share certificates will be issued within 48 hours of confirmed 
        payment receipt and completion of all compliance requirements.
      </p>
      
      <h3>Bank Transfer Details (GBP/USD)</h3>
      <div class="payment-details">
        <p><strong>Account Name:</strong> The Bitcoin Corporation LTD</p>
        <p><strong>Bank Name:</strong> ClearBank</p>
        <p><strong>Account Number:</strong> 28694165</p>
        <p><strong>Sort Code:</strong> 04-06-05</p>
        <p><strong>SWIFT/BIC:</strong> CLRBGB22</p>
        <p><strong>IBAN:</strong> GB02 CLRB 0406 0528 6941 65</p>
        <p><strong>Reference:</strong> BWRITER-[INVESTOR_ID]</p>
      </div>
      
      <h3>BSV Payment Details</h3>
      <div class="payment-details">
        <p><strong>BSV Address:</strong> 1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6</p>
        <p><strong>Network:</strong> Bitcoin SV (BSV)</p>
        <p><strong>Address Type:</strong> $bWriter Treasury (accepts BSV, MNEE, Ordinals, $bWriter)</p>
        <p><strong>Required Memo:</strong> BWRITER-[INVESTOR_ID]</p>
      </div>
      
      <div class="payment-note">
        <p><strong>Important:</strong> Please include the reference code with your payment to ensure proper allocation of bWriter shares. 
        Payments without proper reference may be delayed in processing.</p>
      </div>

      <h1>3. REPRESENTATIONS AND WARRANTIES</h1>
      <h2>3.1 Subscriber Representations</h2>
      <p>The Subscriber represents and warrants that:</p>
      <ul>
        <li>They have full legal capacity and authority to enter into this Agreement</li>
        <li>They are a sophisticated investor as defined under UK FCA regulations</li>
        <li>They have conducted their own due diligence regarding the investment</li>
        <li>They understand the risks associated with cryptocurrency investments</li>
        <li>They are not a resident of any jurisdiction where token sales are prohibited</li>
        <li>All information provided is accurate and complete</li>
      </ul>

      <h2>3.2 Company Representations</h2>
      <p>The Company represents and warrants that:</p>
      <ul>
        <li>It is duly incorporated and validly existing under the laws of England and Wales</li>
        <li>It has full corporate power and authority to issue the Tokens</li>
        <li>The execution and delivery of this Agreement has been duly authorized</li>
        <li>All material information has been disclosed to the Subscriber</li>
      </ul>

      <h1>4. COMPLIANCE AND REGULATORY MATTERS</h1>
      <h2>4.1 KYC/AML Compliance</h2>
      <p>
        The Subscriber acknowledges that completion of Know Your Customer (KYC) and Anti-Money 
        Laundering (AML) procedures is a prerequisite to token issuance. The Company reserves 
        the right to reject any subscription that does not meet compliance requirements.
      </p>

      <h2>4.2 Securities Law Compliance</h2>
      <p>
        This offering is intended to comply with applicable UK securities laws. The bWriter Shares are being 
        offered and sold in compliance with the Financial Services and Markets Act 2000 (FSMA) and 
        applicable FCA regulations for private company equity offerings.
      </p>

      <h1>5. bWRITER SHARE RIGHTS AND RESTRICTIONS</h1>
      <h2>5.1 Share Rights</h2>
      <p>
        bWriter Shares provide holders with specific rights within the Bitcoin Writer platform, 
        including but not limited to:
      </p>
      <ul>
        <li>Bitcoin Writer platform governance voting rights</li>
        <li>Revenue sharing distributions from Bitcoin Writer platform</li>
        <li>Priority access to Bitcoin Writer premium features</li>
        <li>Enhanced customer support and platform access</li>
      </ul>

      <h2>5.2 Transfer Restrictions</h2>
      <p>
        bWriter Shares may be subject to transfer restrictions and lock-up periods as specified in the 
        Shareholder Agreement. Any transfers must comply with applicable securities laws and 
        English company law requirements.
      </p>

      <div class="risk-box">
        <h3>Investment Risks</h3>
        <p>
          The Subscriber acknowledges and accepts the following risks:
        </p>
        <ul>
          <li><strong>Volatility Risk:</strong> Token values may fluctuate significantly</li>
          <li><strong>Technology Risk:</strong> Smart contract and blockchain technology risks</li>
          <li><strong>Regulatory Risk:</strong> Potential changes in cryptocurrency regulations</li>
          <li><strong>Liquidity Risk:</strong> Limited secondary markets for tokens</li>
          <li><strong>Platform Risk:</strong> Success dependent on platform adoption</li>
          <li><strong>Total Loss Risk:</strong> Investment may result in total loss of capital</li>
        </ul>
      </div>

      <h1>6. GOVERNING LAW AND DISPUTE RESOLUTION</h1>
      <h2>6.1 Governing Law</h2>
      <p>
        This Agreement shall be governed by and construed in accordance with the laws of 
        England and Wales, without regard to its conflict of laws principles.
      </p>

      <h2>6.2 Arbitration</h2>
      <p>
        Any disputes arising under this Agreement shall be resolved through binding arbitration 
        administered by the London Court of International Arbitration in accordance with its 
        Arbitration Rules.
      </p>

      <h1>7. MISCELLANEOUS</h1>
      <h2>7.1 Entire Agreement</h2>
      <p>
        This Agreement, together with the Term Sheet and other transaction documents, constitutes 
        the entire agreement between the parties regarding the subject matter hereof.
      </p>

      <h2>7.2 Amendments</h2>
      <p>
        This Agreement may only be amended in writing and signed by both parties.
      </p>

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
            <h4>SUBSCRIBER</h4>
            <div class="signature-line">
              <p>Signature: _________________________________</p>
              <p>Print Name: _________________________________</p>
              <p>Date: _________________________________</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const htmlContent = generateSimplePDF({
      title: 'bWriter Subscription Agreement',
      content,
      filename: 'bitcoin-writer-subscription-agreement.pdf'
    });

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating subscription agreement PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
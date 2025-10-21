import { NextRequest, NextResponse } from 'next/server';
import { generateSimplePDF } from '../../../../utils/simplePdfGenerator';

export async function GET(request: NextRequest) {
  try {
    const content = `
      <div class="legal-notice">
        <h3>Anti-Money Laundering (AML) Compliance</h3>
        <p>
          This document outlines The Bitcoin Corporation LTD's comprehensive anti-money laundering 
          policies and procedures. All investors and business partners must comply with these 
          requirements under UK and international AML regulations.
        </p>
      </div>

      <h1>1. AML POLICY OVERVIEW</h1>
      <h2>1.1 Regulatory Framework</h2>
      <p>
        The Bitcoin Corporation LTD operates a comprehensive Anti-Money Laundering (AML) program 
        in accordance with UK Money Laundering, Terrorist Financing and Transfer of Funds 
        Regulations 2017, Proceeds of Crime Act 2002, and Financial Action Task Force (FATF) 
        recommendations.
      </p>
      <p>
        <strong>Compliance Commitment:</strong> The Company maintains a zero-tolerance policy 
        toward money laundering, terrorist financing, and other financial crimes. All staff, 
        investors, and business partners must adhere to these standards.
      </p>

      <h2>1.2 Scope of Application</h2>
      <p>This AML policy applies to:</p>
      <ul>
        <li>All bWriter Share investment transactions</li>
        <li>Digital asset transactions and BSV payments</li>
        <li>Corporate partnerships and joint ventures</li>
        <li>Third-party service provider relationships</li>
        <li>Cross-border transactions and international investors</li>
      </ul>

      <h1>2. RISK ASSESSMENT FRAMEWORK</h1>
      <h2>2.1 Customer Risk Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Risk Level</th>
            <th>Customer Type</th>
            <th>Due Diligence</th>
            <th>Monitoring Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Low Risk</td>
            <td>UK/EU retail investors</td>
            <td>Standard KYC</td>
            <td>Annual review</td>
          </tr>
          <tr>
            <td>Medium Risk</td>
            <td>High-value retail, SME corporate</td>
            <td>Enhanced KYC</td>
            <td>Bi-annual review</td>
          </tr>
          <tr>
            <td>High Risk</td>
            <td>PEPs, high-risk jurisdictions</td>
            <td>Enhanced Due Diligence</td>
            <td>Quarterly review</td>
          </tr>
          <tr>
            <td>Prohibited</td>
            <td>Sanctioned entities/individuals</td>
            <td>No business relationship</td>
            <td>Immediate termination</td>
          </tr>
        </tbody>
      </table>

      <h2>2.2 Geographic Risk Assessment</h2>
      <p>
        <strong>Low Risk Jurisdictions:</strong> UK, EU/EEA countries, Canada, Australia, 
        New Zealand, Switzerland, Singapore, Japan
      </p>
      <p>
        <strong>Medium Risk Jurisdictions:</strong> United States, other OECD countries 
        with robust AML frameworks
      </p>
      <p>
        <strong>High Risk Jurisdictions:</strong> Countries identified by FATF as having 
        strategic AML/CFT deficiencies or subject to enhanced monitoring
      </p>
      <p>
        <strong>Prohibited Jurisdictions:</strong> Countries subject to UK/EU/UN sanctions, 
        including Russia, Iran, North Korea, and other sanctioned territories
      </p>

      <h1>3. CUSTOMER DUE DILIGENCE (CDD)</h1>
      <h2>3.1 Standard Due Diligence</h2>
      <p>For all customers, the Company conducts:</p>
      <ul>
        <li>Identity verification using government-issued documentation</li>
        <li>Address verification with recent utility bills or statements</li>
        <li>Source of funds verification for investment amounts</li>
        <li>Sanctions screening against UK/EU/UN/OFAC lists</li>
        <li>Adverse media checks for reputational risks</li>
      </ul>

      <h2>3.2 Enhanced Due Diligence (EDD)</h2>
      <p>Enhanced measures are triggered for:</p>
      <ul>
        <li>Politically Exposed Persons (PEPs) and their associates</li>
        <li>Customers from high-risk jurisdictions</li>
        <li>Complex corporate structures or beneficial ownership</li>
        <li>Unusual transaction patterns or amounts</li>
        <li>Cash-intensive businesses or industries</li>
        <li>Cryptocurrency-related business activities</li>
      </ul>

      <h2>3.3 Ongoing Monitoring</h2>
      <p>The Company maintains ongoing monitoring through:</p>
      <ul>
        <li>Real-time transaction monitoring systems</li>
        <li>Periodic customer information updates</li>
        <li>Regular sanctions list screening</li>
        <li>Adverse media monitoring</li>
        <li>Suspicious activity detection and reporting</li>
      </ul>

      <h1>4. SUSPICIOUS ACTIVITY REPORTING</h1>
      <h2>4.1 Suspicious Activity Indicators</h2>
      <p>Staff must report transactions involving:</p>
      <ul>
        <li>Unusual payment methods or sources</li>
        <li>Structuring to avoid reporting thresholds</li>
        <li>Inconsistent customer information</li>
        <li>Rapid movement of funds without clear purpose</li>
        <li>Connections to high-risk countries or entities</li>
        <li>Reluctance to provide required documentation</li>
        <li>Transactions inconsistent with customer profile</li>
      </ul>

      <h2>4.2 Reporting Procedures</h2>
      <p>
        <strong>Internal Reporting:</strong> All suspicious activities must be reported 
        immediately to the Money Laundering Reporting Officer (MLRO).
      </p>
      <p>
        <strong>External Reporting:</strong> The MLRO evaluates reports and submits 
        Suspicious Activity Reports (SARs) to the Financial Intelligence Unit (FIU) 
        within required timeframes.
      </p>
      <p>
        <strong>Confidentiality:</strong> All AML reports are strictly confidential. 
        "Tipping off" customers about investigations is prohibited by law.
      </p>

      <h1>5. SANCTIONS COMPLIANCE</h1>
      <h2>5.1 Sanctions Screening</h2>
      <p>The Company screens all customers and transactions against:</p>
      <ul>
        <li>UK HM Treasury Consolidated List</li>
        <li>EU Consolidated Sanctions List</li>
        <li>UN Security Council Sanctions List</li>
        <li>US OFAC Specially Designated Nationals (SDN) List</li>
        <li>Other relevant international sanctions lists</li>
      </ul>

      <h2>5.2 Sanctions Response Procedures</h2>
      <p>
        <strong>Immediate Actions:</strong> Any sanctions match triggers immediate 
        transaction suspension and senior management notification.
      </p>
      <p>
        <strong>Investigation:</strong> Compliance team conducts detailed investigation 
        to confirm or dismiss potential matches.
      </p>
      <p>
        <strong>Reporting:</strong> Confirmed sanctions violations are reported to 
        relevant authorities within 24 hours.
      </p>

      <h1>6. RECORD KEEPING</h1>
      <h2>6.1 Documentation Requirements</h2>
      <p>The Company maintains comprehensive records including:</p>
      <ul>
        <li>Customer identification and verification documents</li>
        <li>Transaction records and supporting documentation</li>
        <li>Internal suspicious activity reports and investigations</li>
        <li>Sanctions screening results and actions taken</li>
        <li>Staff training records and compliance attestations</li>
      </ul>

      <h2>6.2 Retention Periods</h2>
      <table>
        <thead>
          <tr>
            <th>Record Type</th>
            <th>Retention Period</th>
            <th>Storage Method</th>
            <th>Access Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Customer identification</td>
            <td>5 years after relationship ends</td>
            <td>Encrypted digital storage</td>
            <td>Compliance team only</td>
          </tr>
          <tr>
            <td>Transaction records</td>
            <td>5 years after transaction</td>
            <td>Encrypted digital storage</td>
            <td>Authorized staff only</td>
          </tr>
          <tr>
            <td>SAR documentation</td>
            <td>5 years after filing</td>
            <td>Encrypted digital storage</td>
            <td>MLRO and senior management</td>
          </tr>
          <tr>
            <td>Training records</td>
            <td>3 years after completion</td>
            <td>HR systems</td>
            <td>HR and compliance teams</td>
          </tr>
        </tbody>
      </table>

      <h1>7. STAFF TRAINING AND AWARENESS</h1>
      <h2>7.1 Mandatory Training Program</h2>
      <p>All staff receive comprehensive AML training covering:</p>
      <ul>
        <li>UK and international AML regulations</li>
        <li>Company policies and procedures</li>
        <li>Customer due diligence requirements</li>
        <li>Suspicious activity recognition</li>
        <li>Sanctions compliance procedures</li>
        <li>Record keeping and confidentiality</li>
      </ul>

      <h2>7.2 Training Schedule</h2>
      <p>
        <strong>Initial Training:</strong> All new staff complete AML training within 
        30 days of employment commencement.
      </p>
      <p>
        <strong>Annual Refresher:</strong> All staff complete annual AML training updates 
        covering regulatory changes and emerging risks.
      </p>
      <p>
        <strong>Specialized Training:</strong> Customer-facing and compliance staff 
        receive enhanced training appropriate to their roles.
      </p>

      <h1>8. GOVERNANCE AND OVERSIGHT</h1>
      <h2>8.1 Three Lines of Defense</h2>
      <p>
        <strong>First Line:</strong> Business units implement day-to-day AML controls 
        and identify suspicious activities.
      </p>
      <p>
        <strong>Second Line:</strong> Compliance function provides oversight, guidance, 
        and independent review of AML effectiveness.
      </p>
      <p>
        <strong>Third Line:</strong> Internal audit provides independent assurance on 
        AML program effectiveness and regulatory compliance.
      </p>

      <h2>8.2 Senior Management Responsibility</h2>
      <p>
        The Board of Directors and senior management are ultimately responsible for 
        AML compliance and maintain oversight through regular reporting and review 
        of the AML program's effectiveness.
      </p>

      <h1>9. REGULATORY COOPERATION</h1>
      <h2>9.1 Examinations and Inspections</h2>
      <p>
        The Company cooperates fully with regulatory examinations by the Financial 
        Conduct Authority (FCA) and other relevant authorities, providing timely 
        and complete responses to information requests.
      </p>

      <h2>9.2 Law Enforcement Cooperation</h2>
      <p>
        The Company maintains procedures for responding to law enforcement requests 
        while protecting customer confidentiality where legally permitted.
      </p>

      <div class="signature-section">
        <h2>COMPLIANCE CERTIFICATION</h2>
        <p>
          This AML Policy represents The Bitcoin Corporation LTD's commitment to 
          preventing money laundering and terrorist financing. All staff and 
          business partners must comply with these requirements.
        </p>
        
        <div class="signature-blocks">
          <div class="signature-block">
            <h4>THE BITCOIN CORPORATION LTD</h4>
            <div class="signature-line">
              <p>By: _________________________________</p>
              <p>Name: [MLRO]</p>
              <p>Title: Money Laundering Reporting Officer</p>
              <p>Date: _________________________________</p>
            </div>
          </div>

          <div class="signature-block">
            <h4>BOARD APPROVAL</h4>
            <div class="signature-line">
              <p>Approved by Board of Directors:</p>
              <p>Signature: _________________________________</p>
              <p>Name: [Director]</p>
              <p>Date: _________________________________</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const htmlContent = generateSimplePDF({
      title: 'AML Compliance Policy',
      content,
      filename: 'bitcoin-writer-aml-compliance.pdf'
    });

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating AML compliance PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
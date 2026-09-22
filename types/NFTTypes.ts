/**
 * The `.nft` file format — Bitcoin Writer's own container for a signed document.
 *
 * ⚠ THIS MODULE WAS MISSING ENTIRELY. `services/NFTService.ts`,
 * `services/GrantSubmissionService.ts` and `components/GrantSubmissionForm.tsx` all imported
 * `../types/NFTTypes` and no such file existed anywhere in the repository. `NFTService` has
 * six importers, so this is live code that had never type-checked.
 *
 * ⚠ RECONSTRUCTED FROM USAGE, NOT INVENTED. Every field below is one the existing code
 * actually reads or writes — `header.magicNumber` and `HEADER_SIZE` in the serialiser,
 * `metadata.grantInfo.fundingDetected` in `detectFunding`, `platformData.quality_score` in
 * `awardBWriterTokens`, and so on. Fields the code never touches are deliberately absent:
 * a type that claims more than it knows is worse than a narrow one, because the surplus
 * looks verified and is not.
 *
 * Where the code assigns a literal ('ECDSA-SHA256', 'grant-submission', 'pending'), the
 * literal is widened to `string` only when a second value is also assigned somewhere —
 * otherwise the narrow union is kept, because it is what the code guarantees.
 */

/** Fixed-size record at the head of the file. `HEADER_SIZE` is 256 bytes. */
export interface NFTHeader {
    /** 'BWNF' — Bitcoin Writer NFT. */
    magicNumber: string;
    version: string;
    /** sha-256 over the serialised content. */
    contentHash: string;
    timestamp: number;
    /** Filled in after serialisation, so zero until `create` has written it once. */
    fileSize: number;
    contentType: string;
}

/** A file carried alongside the document. Base64 in `data`; 10 MB each is the cap. */
export interface NFTAttachment {
    filename: string;
    mimeType: string;
    size: number;
    /** Base64. */
    data: string;
}

export interface NFTContent {
    format: 'html' | 'json' | string;
    encoding: string;
    data: string;
    attachments?: NFTAttachment[];
}

/** What a grant application records about itself. */
export interface GrantInfo {
    applicantType: 'developer' | 'author' | 'publisher';
    requestedAmount: number;
    requestedCurrency: 'BSV' | 'BWRITER';
    /** The address watched for incoming funds. */
    fundingAddress: string;
    applicationStatus: 'pending' | 'funded' | 'rejected' | string;
    /** Set by `detectFunding` once something lands. */
    fundingDetected?: { amount: number; txid: string; timestamp: number } | null;
    /** Platform curation signal, in $BWRITER. */
    bwriterAward?: number;
    reviewNotes?: string;
}

/** Terms the creator attaches to the work. */
export interface NFTRights {
    license: string;
    commercialUse: boolean;
    derivatives: boolean;
}

/**
 * Platform-side data.
 *
 * ⚠ ADDED BY `create`, NOT BY THE CALLER — which is why every caller passes
 * `Omit<NFTMetadata, 'platformData'>`. It is optional here because `awardBWriterTokens`
 * guards on its presence before writing to it.
 */
export interface NFTPlatformData {
    tags: string[];
    category: string;
    featured: boolean;
    quality_score: number;
    view_count: number;
    download_count: number;
}

export interface NFTMetadata {
    title: string;
    description: string;
    creatorName: string;
    creatorAddress: string;
    documentType: string;
    grantInfo?: GrantInfo;
    rights?: NFTRights;
    platformData?: NFTPlatformData;
}

export interface NFTSignature {
    creatorSignature: string;
    /**
     * The platform's counter-signature, written by `sign()` alongside the creator's.
     *
     * ⚠ OPTIONAL BECAUSE `create()` DOES NOT SET IT. A freshly created `.nft` has a
     * `creatorSignature` of '' and no platform signature at all; both are filled in later
     * by `sign()`. Declaring it required would make every `create()` call a type error and
     * would also misdescribe the file on disk between those two steps.
     */
    platformSignature?: string;
    timestamp: number;
    algorithm: string;
}

export interface NFTFile {
    header: NFTHeader;
    metadata: NFTMetadata;
    content: NFTContent;
    signature: NFTSignature;
}

/**
 * A grant application, which is an `.nft` whose metadata carries `grantInfo`.
 *
 * ⚠ THE CODE CASTS TO THIS RATHER THAN CONSTRUCTING IT (`sign(...) as GrantSubmission`), so
 * it is deliberately a narrowing of `NFTFile` rather than a separate shape — anything else
 * would make those casts lies.
 */
export interface GrantSubmission extends NFTFile {
    metadata: NFTMetadata & { grantInfo: GrantInfo };
}

/** The operations `BitcoinWriterNFTService` implements. */
export interface NFTService {
    create(content: NFTContent, metadata: Omit<NFTMetadata, 'platformData'>): Promise<NFTFile>;
    read(data: ArrayBuffer | string): Promise<NFTFile>;
    write(nft: NFTFile): Promise<ArrayBuffer>;
    sign(nft: NFTFile, privateKey: string): Promise<NFTFile>;
    detectFunding(nft: GrantSubmission): Promise<NFTFile>;
}

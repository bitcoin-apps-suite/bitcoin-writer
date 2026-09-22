/**
 * Row shapes for the $bWriter staking and dividend tables.
 *
 * ⚠ WHY THESE ARE HAND-WRITTEN. The Supabase client is constructed without generated
 * database types, so every `.select()` returns `any`. Under `noImplicitAny` that surfaced as
 * forty-two TS7006 errors on the callbacks reading those rows — `(s) => s.amount` with `s`
 * implicitly `any`. The errors were the visible symptom; the real cost is that nothing
 * checked a single column name in the dividend and staking paths, which are the paths that
 * decide what somebody is owed.
 *
 * ⚠ THESE DESCRIBE WHAT THE CODE READS, NOT THE FULL SCHEMA. Every field here is one the
 * application actually touches; columns the app never reads are deliberately absent rather
 * than guessed at. A type that claims more than it knows is worse than a narrow one, because
 * the extra fields look verified and are not.
 *
 * The durable fix is generated types (`supabase gen types typescript`). Until that is wired
 * into the build, these give the compiler something true to check against.
 */

/** `user_bwriter_stakes` — one row per stake, through its whole lifecycle. */
export interface BwriterStakeRow {
    id: string;
    user_id: string;
    amount: number;
    /** 'confirmed' | 'pending_deposit' | 'unstaked' — free text in the database. */
    status: string;
    staked_at: string | null;
    unstaked_at: string | null;
    created_at: string | null;
    deposit_deadline: string | null;
    dividends_accumulated: number | null;
}

/** `bwriter_cap_table` — a holder's standing share of the platform. */
export interface BwriterCapTableRow {
    percentage_of_total: number | null;
    last_dividend_amount: number | null;
    lifetime_dividends_received: number | null;
}

/** `bwriter_multisig_deposits` — an expected payment that has not landed yet. */
export interface BwriterDepositRow {
    id: string;
    stake_id: string;
    amount_expected: number;
    status: string;
    created_at: string | null;
}

/** `user_bwriter_balances` — the aggregate position. */
export interface BwriterBalanceRow {
    balance: number;
    total_staked_ever: number | null;
    total_withdrawn: number | null;
}

/** `user_bwriter_dividends_owed` — what is due and what has been taken. */
export interface BwriterDividendsRow {
    dividends_pending: number | null;
    dividends_claimed: number | null;
}

/** `user_bwriter_dividend_addresses` — where a holder's dividends are sent. */
export interface BwriterDividendAddressRow {
    bsv_withdrawal_address: string | null;
    last_dividend_paid_to_address: string | null;
}

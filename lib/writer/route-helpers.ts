import { NextResponse } from 'next/server';
import { ChainError } from './chain';

export function errorResponse(error: any, fallback = 'Request failed') {
  if (error instanceof ChainError) {
    return NextResponse.json({ error: error.message, ...error.extra }, { status: error.status });
  }
  console.error('[writer]', error);
  // HandCash Connect API errors carry httpStatusCode; spend-limit / balance problems are the user's to fix.
  const message = error?.message || fallback;
  const paymentProblem = /limit|balance|funds|insufficient/i.test(message);
  return NextResponse.json(
    { error: message, paymentProblem: paymentProblem || undefined },
    { status: paymentProblem ? 402 : error?.httpStatusCode && error.httpStatusCode < 500 ? error.httpStatusCode : 500 }
  );
}

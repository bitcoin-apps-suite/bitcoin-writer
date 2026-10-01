'use client';
import { useEffect } from 'react';
import { applyShellClasses } from './shell';

/** Mount once in the root layout: sets html.bw-compact / html.bw-inwallet. */
export default function MobileShellInit() {
  useEffect(() => { applyShellClasses(); }, []);
  return null;
}

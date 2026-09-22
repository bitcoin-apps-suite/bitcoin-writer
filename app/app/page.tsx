/**
 * Bitcoin Writer — the gated app. Requires a HandCash session.
 */

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/writer/session';
import AppShell from '@/components/writer/AppShell';
import './shell.css';

export const dynamic = 'force-dynamic';

export default async function AppPage() {
  if (!(await getSession())) redirect('/');
  return <AppShell />;
}

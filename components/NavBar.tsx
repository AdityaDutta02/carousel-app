'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 28px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(13,12,11,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <motion.div whileHover={{ opacity: 0.72 }} transition={{ duration: 0.15 }}>
        <Link href="/" style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
        }}>
          Carousel Studio
        </Link>
      </motion.div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <NavLink href="/" active={pathname === '/'}>Generate</NavLink>
        <NavLink href="/history" active={pathname === '/history'}>History</NavLink>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <motion.div whileHover={{ opacity: 1 }} animate={{ opacity: active ? 1 : 0.45 }} transition={{ duration: 0.2 }}>
      <Link href={href} style={{
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--ink)' : 'inherit',
      }}>
        {children}
      </Link>
    </motion.div>
  );
}

'use client'

import Link from 'next/link'
import { LogOut, Wallet, Receipt } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  if (pathname === '/login') return null

  return (
    <nav style={{ padding: '20px 0', marginBottom: '40px', borderBottom: '1px solid var(--border)' }}>
      <div className="container flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet color="var(--primary)" size={28} />
          <h2 style={{ margin: 0, letterSpacing: '1px' }}>FinanceGuard</h2>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/" style={{ color: pathname === '/' ? 'var(--primary)' : 'var(--text)', fontWeight: 500 }}>
            Dashboard
          </Link>
          <Link href="/expenses" style={{ color: pathname === '/expenses' ? 'var(--primary)' : 'var(--text)', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Receipt size={18} /> Expenses
            </span>
          </Link>
          <button 
            onClick={() => logout()} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowUpRight, ArrowDownRight, CreditCard, Activity } from 'lucide-react'
import InsightsChart from '@/components/InsightsChart'
import { formatCurrency } from '@/lib/utils'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch expenses
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  const totalSpent = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const thisMonthExpenses = expenses?.filter(e => {
    const date = new Date(e.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const monthSpent = thisMonthExpenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  
  const today = new Date().toISOString().split('T')[0]
  const todaySpent = expenses?.filter(e => e.date === today).reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const txCount = expenses?.length || 0

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text)', opacity: 0.8 }}>Welcome back! Here's your financial overview.</p>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '40px' }}>
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '10px', color: 'var(--text)' }}>
            <span>Total Spent</span>
            <Activity size={20} color="var(--primary)" />
          </div>
          <div className="stat-value">{formatCurrency(totalSpent)}</div>
        </div>
        
        <div className="card delay-1">
          <div className="flex-between" style={{ marginBottom: '10px', color: 'var(--text)' }}>
            <span>Spent This Month</span>
            <ArrowUpRight size={20} color="var(--error)" />
          </div>
          <div className="stat-value">{formatCurrency(monthSpent)}</div>
        </div>

        <div className="card delay-2">
          <div className="flex-between" style={{ marginBottom: '10px', color: 'var(--text)' }}>
            <span>Spent Today</span>
            <ArrowDownRight size={20} color="var(--success)" />
          </div>
          <div className="stat-value">{formatCurrency(todaySpent)}</div>
        </div>

        <div className="card delay-3">
          <div className="flex-between" style={{ marginBottom: '10px', color: 'var(--text)' }}>
            <span>Transactions</span>
            <CreditCard size={20} color="var(--primary)" />
          </div>
          <div className="stat-value">{txCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Recent Transactions</h3>
          {expenses && expenses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {expenses.slice(0, 5).map((exp) => (
                <div key={exp.id} className="flex-between" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.7 }}>
                      {exp.date} • <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{exp.category}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.6 }}>No transactions yet.</p>
          )}
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Spending Insights</h3>
          <InsightsChart expenses={expenses || []} />
        </div>
      </div>
    </div>
  )
}

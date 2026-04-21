'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  amount: number
  date: string
  description: string
  category: string
}

export default function InsightsChart({ expenses }: { expenses: Expense[] }) {
  // Aggregate expenses by category for the chart
  const dataMap = expenses.reduce((acc, curr) => {
    const category = curr.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + Number(curr.amount)
    return acc
  }, {} as Record<string, number>)

  const data = Object.keys(dataMap).map(key => ({
    name: key,
    amount: dataMap[key]
  })).sort((a, b) => b.amount - a.amount)

  if (data.length === 0) {
    return (
      <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
        No spending data yet.
      </div>
    )
  }

  return (
    <div style={{ height: '250px', width: '100%', marginTop: '20px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="var(--text)" 
            tick={{ fill: 'var(--text)', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text)" 
            tick={{ fill: 'var(--text)', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(102, 252, 241, 0.05)' }} 
            contentStyle={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }}
            itemStyle={{ color: 'var(--primary)' }}
            formatter={(value: any) => [formatCurrency(value), 'Amount']}
          />
          <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

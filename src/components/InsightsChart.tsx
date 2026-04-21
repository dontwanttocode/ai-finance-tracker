'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
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

const COLORS = ['#66fcf1', '#c792ea', '#ffd700', '#ff7f50', '#82ca9d', '#ff6b6b']

  return (
    <div style={{ height: '250px', width: '100%', marginTop: '20px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }}
            itemStyle={{ color: 'var(--text)' }}
            formatter={(value: any) => [formatCurrency(value), 'Amount']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            wrapperStyle={{ fontSize: '12px' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

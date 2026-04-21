import { login, signup } from '@/app/auth/actions'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Wallet color="var(--primary)" size={48} />
        </div>
        <h1 style={{ marginBottom: '30px' }}>Welcome Back</h1>
        
        <form style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input className="input-field" id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="input-group" style={{ marginBottom: '30px' }}>
            <label className="input-label" htmlFor="password">Password</label>
            <input className="input-field" id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          
          <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
            <button formAction={login} className="btn-primary" style={{ width: '100%' }}>
              Log In
            </button>
            <button formAction={signup} className="btn-outline" style={{ width: '100%' }}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

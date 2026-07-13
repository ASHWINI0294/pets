import UserProfile from './components/UserProfile'
import TransactionsSection from './components/TransactionsSection'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>My Dashboard</h1>
        <p>Your account overview and recent activity.</p>
      </header>

      <main className="content">
        <UserProfile />
        <TransactionsSection />
      </main>
    </div>
  )
}

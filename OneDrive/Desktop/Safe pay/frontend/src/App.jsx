import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'
import MessageScanner from './pages/MessageScanner'
import TransactionHistory from './pages/TransactionHistory'
import FraudReport from './pages/FraudReport'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/scanner" element={<MessageScanner />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/report" element={<FraudReport />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

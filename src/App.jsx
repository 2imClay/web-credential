import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CaseStudyDetailPage from './pages/CaseStudyDetailPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

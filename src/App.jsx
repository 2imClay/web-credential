import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CaseStudyDetailPage from './pages/CaseStudyDetailPage'
import AdminPage from './pages/AdminPage'
import Preloader from './components/Preloader'

export default function App() {
  return (
    <>
      <Preloader />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

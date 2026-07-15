import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ProductsPage from './pages/ProductsPage'
import IndustriesPage from './pages/IndustriesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
      </Route>
    </Routes>
  )
}

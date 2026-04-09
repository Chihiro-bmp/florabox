import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CardBuilder from './pages/CardBuilder'
import BouquetBuilder from './pages/BouquetBuilder'
import CardView from './pages/CardView'
import MyCreations from './pages/MyCreations'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card/new" element={<CardBuilder />} />
        <Route path="/bouquet/new" element={<BouquetBuilder />} />
        <Route path="/view/:id" element={<CardView />} />
        <Route path="/u/:username" element={<MyCreations />} />
      </Routes>
    </BrowserRouter>
  )
}

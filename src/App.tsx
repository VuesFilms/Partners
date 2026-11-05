import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import FranchiseDetail from './pages/FranchiseDetail';
import InvestorDetail from './pages/InvestorDetail';
import InvestorDirectory from './pages/InvestorDirectory';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })}>
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/franchises" element={<Marketplace />} />
            <Route path="/franchises/:id" element={<FranchiseDetail />} />
            <Route path="/investors" element={<InvestorDirectory />} />
            <Route path="/investors/:id" element={<InvestorDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

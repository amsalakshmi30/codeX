import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AgriDashboard } from '@/pages/dashboard/AgriDashboard';
import { SingleLeafScanner } from '@/pages/scanner/SingleLeafScanner';
import { ThreeZoneScanner } from '@/pages/scanner/ThreeZoneScanner';
import { CropAnalytics } from '@/pages/analytics/CropAnalytics';
import { ScanHistory } from '@/pages/history/ScanHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Agricultural AI Suite in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<AgriDashboard />} />
          <Route path="/scanner/single" element={<SingleLeafScanner />} />
          <Route path="/scanner/three-zone" element={<ThreeZoneScanner />} />
          <Route path="/analytics" element={<CropAnalytics />} />
          <Route path="/history" element={<ScanHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

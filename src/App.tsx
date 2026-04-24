import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import ReportDetails from './pages/ReportDetails';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import AddVehicleOnboarding from './pages/AddVehicleOnboarding';
import AppLayout from './components/layout/AppLayout';
import PlainAppLayout from './components/layout/PlainAppLayout';
import PublicFlowLayout from './components/layout/PublicFlowLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/app/Home';
import Vehicles from './pages/app/Vehicles';
import AddVehicle from './pages/app/AddVehicle';
import EditVehicle from './pages/app/EditVehicle';
import Incidents from './pages/app/Incidents';
import IncidentDetails from './pages/app/IncidentDetails';
import Profile from './pages/app/Profile';
import EditProfile from './pages/app/EditProfile';
import Leaderboard from './pages/app/Leaderboard';
import CompleteProfile from './pages/CompleteProfile';

import { StoreProvider } from './utils/store';

const ProtectedOutlet = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<PublicFlowLayout />}>
            <Route path="/" element={<Onboarding />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/success" element={<Success />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/vehicle/add-onboarding" element={<AddVehicleOnboarding />} />
          </Route>

          <Route element={<PlainAppLayout />}>
            <Route path="/app/reports" element={<ReportDetails />} />
            <Route path="/app/report-details" element={<ReportDetails />} />

            {/* ✅ PUBLIC ADD VEHICLE ROUTES */}
            <Route path="/vehicle/add" element={<AddVehicle />} />
            <Route path="/app/vehicles/add" element={<AddVehicle />} />
          </Route>

          <Route path="/app" element={<ProtectedOutlet />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/app/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="history" element={<Incidents />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route element={<PlainAppLayout />}>
              <Route path="vehicles/:id/edit" element={<EditVehicle />} />
              <Route path="incidents/:id" element={<IncidentDetails />} />
              <Route path="profile/edit" element={<EditProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
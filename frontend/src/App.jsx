import './styles/variables.css';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext.jsx';
import { TripProvider } from './context/TripContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Navbar from './components/common/Navbar.jsx';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import MyTrips from './pages/Trips/MyTrips.jsx';
import CreateTrip from './pages/Trips/CreateTrip.jsx';
import TripDetail from './pages/Trips/TripDetail.jsx';
import ItineraryBuilder from './pages/Itinerary/ItineraryBuilder.jsx';
import ItineraryView from './pages/Itinerary/ItineraryView.jsx';
import CitySearch from './pages/Search/CitySearch.jsx';
import ActivitySearch from './pages/Search/ActivitySearch.jsx';
import BudgetView from './pages/Budget/BudgetView.jsx';
import PackingChecklist from './pages/Checklist/PackingChecklist.jsx';
import TripNotes from './pages/Notes/TripNotes.jsx';
import Community from './pages/Community/Community.jsx';
import UserProfile from './pages/Profile/UserProfile.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import PublicItinerary from './pages/Public/PublicItinerary.jsx';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ paddingTop: 64, minHeight: '100vh' }}>{children}</main>
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TripProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/share/:shareToken" element={<PublicItinerary />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><Layout><MyTrips /></Layout></ProtectedRoute>} />
              <Route path="/trips/new" element={<ProtectedRoute><Layout><CreateTrip /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id" element={<ProtectedRoute><Layout><TripDetail /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id/builder" element={<ProtectedRoute><Layout><ItineraryBuilder /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id/itinerary" element={<ProtectedRoute><Layout><ItineraryView /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id/budget" element={<ProtectedRoute><Layout><BudgetView /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id/checklist" element={<ProtectedRoute><Layout><PackingChecklist /></Layout></ProtectedRoute>} />
              <Route path="/trips/:id/notes" element={<ProtectedRoute><Layout><TripNotes /></Layout></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Layout><CitySearch /></Layout></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute><Layout><ActivitySearch /></Layout></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
          </BrowserRouter>
        </TripProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

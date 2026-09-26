import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import DonorProfile from "./pages/DonorProfile";
import CreateBloodRequest from "./pages/CreateBloodRequest";
import MyRequests from "./pages/MyRequests";
import MatchingDonors from "./pages/MatchingDonors";
import ContactRequests from "./pages/ContactRequest";
import ContactDetails from "./pages/ContactDetails";
import MyContacts from "./pages/MyContact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor-profile"
          element={
            <ProtectedRoute>
              <DonorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blood-request/create"
          element={
            <ProtectedRoute>
              <CreateBloodRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blood-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blood-requests/:requestId/matches"
          element={
            <ProtectedRoute>
              <MatchingDonors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-requests"
          element={
            <ProtectedRoute>
              <ContactRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-requests/:requestId/contact"
          element={
            <ProtectedRoute>
              <ContactDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-contacts"
          element={
            <ProtectedRoute>
              <MyContacts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

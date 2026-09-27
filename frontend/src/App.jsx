import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";

import DonorProfile from "./pages/DonorProfile";
import CreateBloodRequest from "./pages/CreateBloodRequest";
import MyRequests from "./pages/MyRequests";
import MatchingDonors from "./pages/MatchingDonors";
import ContactRequests from "./pages/ContactRequest";
import ContactDetails from "./pages/ContactDetails";
import MyContacts from "./pages/MyContact";
import SentContactRequests from "./pages/sentContactRequest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donor-profile" element={<DonorProfile />} />
          <Route path="/sent-contact-requests" element={<SentContactRequests />} />
          <Route
            path="/blood-request/create"
            element={<CreateBloodRequest />}
          />
          <Route path="/blood-requests" element={<MyRequests />} />
          <Route
            path="/blood-requests/:requestId/matches"
            element={<MatchingDonors />}
          />
          <Route path="/contact-requests" element={<ContactRequests />} />
          <Route
            path="/contact-requests/:requestId/contact"
            element={<ContactDetails />}
          />
          <Route path="/my-contacts" element={<MyContacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

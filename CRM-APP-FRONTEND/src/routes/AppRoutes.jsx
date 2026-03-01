import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import Ticketpage from "../pages/Tickets/TicketsPage";
import TicketDetailPage from "../pages/Tickets/TicketDetailPage";
import LeadsPage from "../pages/leads/LeadsPage";
import LeadDetailsPage from "../pages/leads/LeadDetailsPage";
import DealsPage from "../pages/Deals/DealsPage";
import DealDetailsPage from "../pages/Deals/DealDetailsPage";
import Companies from "../pages/Company/Companies";
import CompanyDetails from "../pages/Company/CompanyDetails";
import ReportsPage from "../pages/Reports/ReportsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        <Route path="/Tickets" element={<Ticketpage />} />

        <Route
          path="/Tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <LeadsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <LeadDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies/:id"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deals"
          element={
            <ProtectedRoute>
              <DealsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deals/:id"
          element={
            <ProtectedRoute>
              <DealDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

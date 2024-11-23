import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Users from "./pages/Users";
import Incidents from "./pages/Incidents";
import Plans from "./pages/Plans";
import Roles from "./pages/Roles";
import Activity from "./pages/Activity";
import Create from "./pages/Create";
import Admin from "./pages/Admin";
import Permissions from "./pages/Permissions";
import "./internalization/i18n";
import SuscriptionSummary from "./pages/SuscriptionSummary";
import SubscriptionPage from "./pages/SuscriptionPage";
import LoginCognito from "./pages/LoginCognito";
import SubscriptionsBase from "./pages/SubscriptionsBase";
import ReportIframe from "./components/Reports/ReportIframe";
import { ProfileProvider } from "./contexts/ProfileContext";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="" element={<LoginCognito />} />
        <Route path="/" element={<LoginCognito />} />
        <Route path="/signin" element={<Dashboard />} />
        <Route path="/signup" element={<Dashboard />} />
        <Route path="/callback" element={<LoginCognito />} />

        {/* Private Routes inside Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProfileProvider>
                <Dashboard />
              </ProfileProvider>
            </PrivateRoute>
          }
        >
          <Route path="summary" element={<ReportIframe />} />
          <Route path="users" element={<Users />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="plans" element={<Plans />} />
          <Route path="roles" element={<Roles />} />
          <Route path="activity" element={<Activity />} />
          <Route path="create" element={<Create />} />
          <Route path="admin" element={<Admin />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="user-plan" element={<SubscriptionPage />} />
          <Route path="manage-plan" element={<SuscriptionSummary />} />
          <Route path="suscriptions" element={<SubscriptionsBase />} />
          <Route path="reports" element={<ReportIframe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

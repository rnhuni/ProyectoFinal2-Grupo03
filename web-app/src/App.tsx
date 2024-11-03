import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Summary from "./pages/Summary";
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
import UserPlan from "./pages/UserPlan";
import TestHooks from "./pages/TestHooks";
import SubscriptionPage from "./pages/SuscriptionPage";
import LoginCognito from "./pages/LoginCognito";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="" element={<LoginCognito />} />
        <Route path="/" element={<LoginCognito />} />
        <Route path="/signin" element={<LoginCognito />} />
        <Route path="/signup" element={<LoginCognito />} />
        <Route path="/callback" element={<LoginCognito />} />

        {/* Private Routes inside Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="summary" element={<Summary />} />
          <Route path="users" element={<Users />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="plans" element={<Plans />} />
          <Route path="roles" element={<Roles />} />
          <Route path="activity" element={<Activity />} />
          <Route path="create" element={<Create />} />
          <Route path="admin" element={<Admin />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="suscription" element={<SubscriptionPage />} />
          <Route path="suscription-user" element={<SuscriptionSummary />} />
          <Route path="user-plan" element={<UserPlan />} />
          <Route path="hooks" element={<TestHooks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

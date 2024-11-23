import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginCognito from "./pages/LoginCognito";
import Dashboard from "./pages/Dashboard";
import "./internalization/i18n";
import { ProfileProvider } from "./contexts/ProfileContext";
import { routesConfig } from "./routesConfig";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginCognito />} />
        <Route path="/signin" element={<LoginCognito />} />
        <Route path="/signup" element={<LoginCognito />} />
        <Route path="/callback" element={<LoginCognito />} />
        <Route
          path="/dashboard"
          element={
            <ProfileProvider>
              <Dashboard />
            </ProfileProvider>
          }
        >
          {routesConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace("/dashboard/", "")}
              element={
                <PrivateRoute allowedRoles={route.roles}>
                  <route.component />
                </PrivateRoute>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

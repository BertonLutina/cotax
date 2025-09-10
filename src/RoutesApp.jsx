import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useLayoutEffect, useState } from "react";

import Dashboard from "./views/dashboard/Dashboard";
import Civil from "./views/civil/Civil";
import Dossiers from "./views/dossiers/Dossiers";
import Gov from "./views/gov/Gov";
import Rapport from "./views/rapport/Rapport";
import Locations from "./views/locations/Locations";
import Entreprises from "./views/entreprise/Entreprises";
import SmallScreenSidebar from "./views/dashboard/components/Sidebar/SmallScreenSidebar";
import DesktopSidebar from "./views/dashboard/components/Sidebar/DesktopSidebar";
import { Declaration } from "./views/client/Declaration";

import SignIn from "./views/auth/Signin";
import Registration from "./views/auth/Registeration";
import TopBar from "./views/dashboard/components/Topbar/TopBar";
import FlagLoader from "./components/spinners/flagloader";
import ProfileModal from "./views/auth/profilemodal";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./Layout";
import Signin from "./views/auth/Signin";
import Approved from "./views/status/Approved";
import NotApproved from "./views/status/NotApproved";
import Pending from "./views/status/Pending";
import Declarations from "./views/client/Declarations";
import ProtectedRoute from "./context/ProtectedRoute";

function RoutesApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // toggle between login/register
  const [openModal, setopenModal] = useState(false);
  const [showLoader, setshowLoader] = useState(false);

  if (showLoader)
    return (
      <div className="bg-red-500 h-screen w-full">
        <FlagLoader showLoader={showLoader} />
      </div>
    );

  return (
      <Router>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="/civil" element={<Civil />} />
            <Route path="/entreprise" element={<Entreprises />} />
            <Route path="/gov" element={<Gov />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/dossiers" element={<Dossiers />} />
            <Route path="/rapport" element={<Rapport />} />
            <Route path="/declarations" element={<Declarations />} />
            <Route path="/declaration" element={<Declaration />} />
            <Route path="/approved" element={<Approved />} />
            <Route path="/notapproved" element={<NotApproved />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default RoutesApp;

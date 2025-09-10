import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./views/dashboard/Dashboard";
import Civil from "./views/civil/Civil";
import Dossiers from "./views/dossiers/Dossiers";
import Gov from "./views/gov/Gov";
import Rapport from "./views/rapport/Rapport";
import Locations from "./views/locations/Locations";
import Entreprises from "./views/entreprise/Entreprises";
import { Declaration } from "./views/client/Declaration";
import Registration from "./views/auth/Registeration";
import Layout from "./Layout";
import Signin from "./views/auth/Signin";
import Approved from "./views/status/Approved";
import NotApproved from "./views/status/NotApproved";
import Pending from "./views/status/Pending";
import Declarations from "./views/client/Declarations";
import ProtectedRoute from "./context/ProtectedRoute";

function RoutesApp() {
 

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

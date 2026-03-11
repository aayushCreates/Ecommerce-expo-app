import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import DashboardLayout from "./Layouts/DashboardLayout";
import PageLoader from "./components/PageLoader";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <PageLoader />;

  return (
    <Routes>
      <Route
        path="/"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <Landing />}
      />
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <Login />}
      />
      
      {/* Protected Dashboard Routes */}
      <Route element={isSignedIn ? <DashboardLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

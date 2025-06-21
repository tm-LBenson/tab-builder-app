// example usage in App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash/Splash";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider, PrivateRoute } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<Splash />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Footer />
    </>
  );
}

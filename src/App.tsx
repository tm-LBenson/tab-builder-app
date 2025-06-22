import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash/Splash";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider, PrivateRoute } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SongBuilder from "./pages/SongBuilder/SongBuilder";
import SongView from "./pages/View/SongView";

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

            <Route
              path="/songs/new"
              element={
                <PrivateRoute>
                  <SongBuilder />
                </PrivateRoute>
              }
            />
            <Route
              path="/songs/:id/edit"
              element={
                <PrivateRoute>
                  <SongBuilder />
                </PrivateRoute>
              }
            />
            <Route
              path="/songs/:id"
              element={
                <PrivateRoute>
                  <SongView />
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

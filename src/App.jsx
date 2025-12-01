import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyEntriesPage from "./pages/MyEntriesPage";
import EntryFormPage from "./pages/EntryFormPage";
import MyProfilePage from "./pages/MyProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/me/entries"
            element={
              <ProtectedRoute>
                <MyEntriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/entries/new"
            element={
              <ProtectedRoute>
                <EntryFormPage mode="create" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/entries/:id/edit"
            element={
              <ProtectedRoute>
                <EntryFormPage mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/users/:username" element={<PublicProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ExplorePublicPage from "./pages/ExplorePublicPage.jsx";
import MyEntriesPage from "./pages/MyEntriesPage.jsx";
import EntryDetailPage from "./pages/EntryDetailPage.jsx";
import EntryFormPage from "./pages/EntryFormPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FollowersPage from "./pages/FollowersPage.jsx";
import FollowRequestsPage from "./pages/FollowRequestsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <div>
      <Navbar />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<FeedPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/explore" element={<ExplorePublicPage />} />

          <Route path="/entries/:id" element={<EntryDetailPage />} />
          <Route
            path="/entries/new"
            element={
              <ProtectedRoute>
                <EntryFormPage mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entries/:id/edit"
            element={
              <ProtectedRoute>
                <EntryFormPage mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/entries"
            element={
              <ProtectedRoute>
                <MyEntriesPage />
              </ProtectedRoute>
            }
          />

          <Route path="/users/:username" element={<ProfilePage />} />

          <Route
            path="/me/followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/follow-requests"
            element={
              <ProtectedRoute>
                <FollowRequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

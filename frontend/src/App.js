import React from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper
} from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthPageRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const { error } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(15,118,110,0.18), transparent 35%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)"
      }}
    >
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {error ? (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Paper>
        ) : null}

        <Routes>
          <Route
            path="/login"
            element={
              <AuthPageRoute>
                <Login />
              </AuthPageRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthPageRoute>
                <Signup />
              </AuthPageRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(15, 23, 42, 0.82)",
        backdropFilter: "blur(14px)"
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          <Stack
            component={Link}
            to="/"
            direction="row"
            spacing={1.5}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14b8a6 0%, #f97316 100%)",
                mt: 0.75
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Social Post App
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Share updates with your circle
              </Typography>
            </Box>
          </Stack>

          {token ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                {user?.name || "Signed in"}
              </Typography>
              <Button color="secondary" variant="contained" onClick={handleLogout}>
                Log Out
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/login" color="inherit">
                Log In
              </Button>
              <Button component={Link} to="/signup" color="secondary" variant="contained">
                Sign Up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

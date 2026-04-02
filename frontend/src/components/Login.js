import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back
          </Typography>
          <Typography color="text.secondary">
            Log in to keep posting and catch up with your feed.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              required
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              required
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            <Button
              disabled={submitting}
              type="submit"
              size="large"
              variant="contained"
            >
              {submitting ? "Logging in..." : "Log In"}
            </Button>
          </Stack>
        </Box>

        <Typography color="text.secondary">
          Need an account?{" "}
          <MuiLink component={Link} to="/signup" underline="hover">
            Sign up
          </MuiLink>
        </Typography>
      </Stack>
    </Paper>
  );
}

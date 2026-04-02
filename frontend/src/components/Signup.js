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

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
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
      await signup(form);
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
            Create your account
          </Typography>
          <Typography color="text.secondary">
            Start posting updates, reacting to friends, and building your feed.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              required
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
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
              helperText="Use at least 6 characters."
              value={form.password}
              onChange={handleChange}
            />
            <Button
              disabled={submitting}
              type="submit"
              size="large"
              variant="contained"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </Button>
          </Stack>
        </Box>

        <Typography color="text.secondary">
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" underline="hover">
            Log in
          </MuiLink>
        </Typography>
      </Stack>
    </Paper>
  );
}

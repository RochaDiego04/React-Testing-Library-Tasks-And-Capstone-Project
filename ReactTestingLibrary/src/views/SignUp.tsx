import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { signupValidationSchema } from "../utils/validation/validation";

import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { status, error, handleSignUp } = useAuth();

  const onSignUp = async (
    values: { email: string; fullName: string; password: string },
    { setSubmitting }: any
  ) => {
    await handleSignUp(values.email, values.fullName, values.password);
    setSubmitting(false);
  };

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{
            email: "",
            fullName: "",
            password: "",
            passwordConfirmation: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={onSignUp}
        >
          {({ isSubmitting, isValid }) => (
            <Form noValidate>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="FullName"
                name="fullName"
                autoComplete="name"
                autoFocus
                helperText={
                  <ErrorMessage name="fullName">
                    {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                  </ErrorMessage>
                }
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                helperText={
                  <ErrorMessage name="email">
                    {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                  </ErrorMessage>
                }
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                helperText={
                  <ErrorMessage name="password">
                    {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                  </ErrorMessage>
                }
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="passwordConfirmation"
                label="Password Confirmation"
                name="passwordConfirmation"
                type="password"
                helperText={
                  <ErrorMessage name="passwordConfirmation">
                    {(msg) => <span style={{ color: "red" }}>{msg}</span>}
                  </ErrorMessage>
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting || !isValid}
              >
                Sign Up
              </Button>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Grid container>
                <Grid item>
                  <Link to="/login">{"Already have an account? Login"}</Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default SignUp;

import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { loginValidationSchema } from "../utils/validation/validation";

import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";

const Login: FC = () => {
  const navigate = useNavigate();
  const { status, error, handleLogin } = useAuth();

  const onLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: any
  ) => {
    await handleLogin(values.email, values.password);
    setSubmitting(false);
  };

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <>
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
            Login
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={onLogin}
          >
            {({ isSubmitting, isValid }) => (
              <Form noValidate>
                <Field
                  as={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText={
                    <ErrorMessage name="password">
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
                  Login
                </Button>
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                <Grid container>
                  <Grid item>
                    <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </>
  );
};

export default Login;

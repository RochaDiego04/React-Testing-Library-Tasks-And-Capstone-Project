import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container style={{ textAlign: "center", marginTop: "5rem" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;

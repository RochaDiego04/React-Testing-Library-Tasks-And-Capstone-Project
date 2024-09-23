import React from "react";
import ResponsiveAppBar from "../components/AppBar";

import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      <ResponsiveAppBar />
      <div>
        <h1>Welcome to Your Task Manager</h1>
        <nav>
          <ul>
            <li>
              <Link to="/projects">View Projects</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Home;

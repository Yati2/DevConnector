import React, { Fragment, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layouts/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import "./App.css";

//Redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  console.log("app");

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  //UseEffect will be perform after the components are rendered
  //Empty dependency array makes the useEffect run only at first

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>

          <section className="container">
            <Alert />
            <Routes>
              <Route path="/register" element={<Register />} />
              {/* {loadUser()} */}
              <Route path="/login" element={<Login />} />
              {loadUser()}
              <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

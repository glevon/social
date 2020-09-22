import React, { Component } from "react";
import Signup from "./components/Signup";
import { BrowserRouter, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import ManageAccount from "./components/ManageAccount";
import FrProfile from "./components/FrProfile";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" exact component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/profile/edit" component={ManageAccount} />
        <Route path="/friend/:id/profile" exact component={FrProfile} />

      </BrowserRouter>
    );
  }
}

export default App;

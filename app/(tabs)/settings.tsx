/** @format */

import { UserContextProvider } from "@/src/context/UserContext";
import ProfileScreen from "@/src/screens/App/Profile/ProfileScreen";
import { Component } from "react";

export class settings extends Component {
  render() {
    return (
      <UserContextProvider>
        <ProfileScreen />
      </UserContextProvider>
    );
  }
}

export default settings;

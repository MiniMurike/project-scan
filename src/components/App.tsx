import React from 'react';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {connect} from "react-redux";

import Header from "./Header";
import Footer from "./Footer";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import SearchPage from "./SearchPage";
import CompanyDataPage from "./CompanyDataPage";

import { updateProfile } from "../store/userSlice";
import {RootState} from "../store/store";
import {updateWindowWidth} from "../store/appSlice";

function App(props) {
    window.addEventListener('resize', () => props.updateWindowWidth(window.innerWidth))
    React.useEffect(() => {
        const currentTime = new Date;
        const expireTime = new Date(localStorage.getItem("expire"))

        props.updateWindowWidth(window.outerWidth);

        if (expireTime > currentTime) {
            props.updateProfile({
                token: {
                    value: localStorage.getItem("token"),
                    expire: localStorage.getItem("expire")
                },
                username: localStorage.getItem("username"),
                avatar: localStorage.getItem("avatar"),
            })
        }

        const timerID = setInterval(() => {
            if (localStorage.getItem("token").length) {
                if (expireTime < currentTime) {
                    props.updateProfile(null)
                    localStorage.removeItem("token");
                    localStorage.removeItem("expire");
                    localStorage.removeItem("username");
                    localStorage.removeItem("avatar");
                }
            }
        }, 1000 * 60);
        return () => {
            clearInterval(timerID);
        }
    }, []);
    return (
        <>
          <Header />
          <Routes>
              <Route
                  path={"/"}
                  element={<MainPage />}
              />
              <Route
                  path={"/login"}
                  element={<LoginPage />}
              />
              <Route
                path={"/search"}
                element={<CompanyDataPage />}
              />
          </Routes>
          <Footer />
        </>
    );
}

export default connect(
    (state: RootState) => ({
        user: state.user
    }),
    { updateProfile, updateWindowWidth }
)(App);

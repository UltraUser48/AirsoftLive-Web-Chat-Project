import Vue from "vue";
import Router from "vue-router";

import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import auth from "firebase/auth";
import About from "../pages/About";
import AirsoftInfo from "../pages/AirsoftInfo";
import ErrorPage from "../pages/ErrorPage";
import Contact from "../pages/Contact";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "chat",
            component: Chat,
            beforeEnter: (to, from, next) => {
                if (!firebase.auth().currentUser) {
                    next("/login");
                } else {
                    next();
                }
            }
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/about",
            name: "about",
            component: About
        },
        {
            path: "/contact",
            name: "contact",
            component: Contact
        },
        {
            path: "/airsoftinfo",
            name: "airsoftinfo",
            component: AirsoftInfo
        },
        {
          path: "/register",
          name: "register",
          component: Register
        },
        {
        path: "*",
        name: "error",
        component: ErrorPage
    }
    ],
    mode: "history"
});
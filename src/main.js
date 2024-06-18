import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import { firebaseConfig, axiosBaseURL, axiosHeaders } from "./config";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./js/routes";
import store from "./js/store";
import "./assets/css/style.css";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const firebaseAuth = getAuth(firebase);

app.use(router).use(store);
app.provide("firebaseAuth", firebaseAuth);
app.provide("firebase", firebase);
app.provide("db", db);

axios.defaults.baseURL = axiosBaseURL;
axios.defaults.headers = axiosHeaders;
app.config.globalProperties.$currentUser = null;
app.mount("#app");

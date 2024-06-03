import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
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

axios.defaults.baseURL =  process.env.VUE_APP_MODE == "env"
      ? "http://localhost:3000/api/"
      : "https://badmintontutor-backend.netlify.app/api/";

axios.defaults.headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  "Access-Control-Allow-Private-Network": true,
};

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: "https://badmintonposecounter-default-rtdb.firebaseio.com",
  projectId: "badmintonposecounter",
  storageBucket: "badmintonposecounter.appspot.com",
  messagingSenderId: "1083314634615",
  appId: "1:1083314634615:web:df7a622543dad315d26b72",
  measurementId: "G-X3X9RWL768",
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const firebaseAuth = getAuth(firebase);

app.use(router).use(store);
app.provide("firebaseAuth", firebaseAuth);
app.provide("firebase", firebase);
app.provide("db", db);

// app.config.globalProperties.$axios = axiosInstance;
app.config.globalProperties.$currentUser = null;
app.mount("#app");

const axiosBaseURL =
  process.env.VUE_APP_MODE == "env"
    ? "http://localhost:80/api/"
    : "https://badmintontutor-backend-bf08e17698c1.herokuapp.com/api/";

const baseURL =
    process.env.VUE_APP_MODE == "env"
      ? "http://localhost:80/"
      : "https://badmintontutor-backend-bf08e17698c1.herokuapp.com/";

const axiosHeaders = {
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

module.exports = {
  axiosBaseURL,
  axiosHeaders,
  firebaseConfig,
  baseURL
};

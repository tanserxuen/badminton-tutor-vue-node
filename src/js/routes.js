import SignUp from "../components/SignUp.vue";
import SignIn from "../components/SignIn.vue";
import ViewProfile from "../components/ViewProfile.vue";
import DashBoard from "../components/DashBoard.vue";
import UpdatePassword from "../components/UpdatePassword.vue";
import ResetPassword from "../components/ResetPassword.vue";

const routes = [
  { path: "/signin", name:"SignIn", component: () => SignIn },
  { path: "/signup", name:"SignUp", component: () => SignUp },
  { path: "/profile", name:"Profile", component: () => ViewProfile },
  { path: "/dashboard", name:"DashBoard", component: () => DashBoard },
  { path: "/update-password", name:"UpdatePassword", component: () => UpdatePassword },
  { path: "/reset-password", name:"ResetPassword", component: () => ResetPassword },
];

export default routes;

import SignUp from "../components/SignUp.vue";
import SignIn from "../components/SignIn.vue";
import ViewProfile from "../components/ViewProfile.vue";
import UpdateProfile from "../components/UpdateProfile.vue";
import DashBoard from "../components/DashBoard.vue";
import UpdatePassword from "../components/UpdatePassword.vue";
import ResetPassword from "../components/ResetPassword.vue";
import PoseCounter from "../components/PoseCounter.vue";
import PostsIndex from "../components/PostsIndex.vue";
import PostView from "../components/PostView.vue";
import PostCreate from "../components/PostCreate.vue";
import ConnectionIndex from "../components/ConnectionIndex.vue";

const routes = [
  { path: "/signin", name:"SignIn", component: () => SignIn },
  { path: "/signup", name:"SignUp", component: () => SignUp },
  { path: "/profile", name:"Profile", component: () => ViewProfile },
  { path: "/update-profile", name:"UpdateProfile", component: () => UpdateProfile },
  { path: "/dashboard", name:"DashBoard", component: () => DashBoard },
  { path: "/update-password", name:"UpdatePassword", component: () => UpdatePassword },
  { path: "/reset-password", name:"ResetPassword", component: () => ResetPassword },
  { path: "/pose-counter", name:"PoseCounter", component: () => PoseCounter },
  { path: "/posts", name:"PostsIndex", component: () => PostsIndex },
  { path: "/post/:index", name:"PostView", component: () => PostView, props: true },
  { path: "/post-create", name:"PostCreate", component: () => PostCreate },
  { path: "/connects-index", name:"ConnectionIndex", component: () => ConnectionIndex },
];

export default routes;

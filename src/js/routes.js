import SignUp from "@/components/Authentication/SignUp.vue";
import SignIn from "@/components/Authentication/SignIn.vue";
import ViewProfile from "@/components/UserManagement/ViewProfile.vue";
import UpdateProfile from "@/components/UserManagement/UpdateProfile.vue";
import DashBoard from "@/components/DashBoard.vue";
import UpdatePassword from "@/components/UserManagement/UpdatePassword.vue";
import ResetPassword from "@/components/Authentication/ResetPassword.vue";
import TutorialDisplay from "@/components/Demontration/TutorialDisplay.vue";
import PostsIndex from "@/components/Post/PostsIndex.vue";
import PostView from "@/components/Post/PostView.vue";
import PostCreate from "@/components/Post/PostCreate.vue";
import PostEdit from "@/components/Post/PostEdit.vue";
import FeedsIndex from "@/components/Connection/FeedsIndex.vue";
import ConnectionIndex from "@/components/Connection/ConnectionIndex.vue";
import FeedbackHistory from "@/components/AnalyticsReport/FeedbackHistory.vue";
import DetailedAnalytics from "@/components/AnalyticsReport/DetailedAnalytics.vue";
import TrainingPose from "@/components/Demontration/TrainingPose.vue";

const routes = [
  { path: "/signin", name:"SignIn", component: () => SignIn },
  { path: "/signup", name:"SignUp", component: () => SignUp },
  { path: "/profile/:id", name:"Profile", component: () => ViewProfile, props: true},
  { path: "/update-profile", name:"UpdateProfile", component: () => UpdateProfile },
  { path: "/dashboard", name:"DashBoard", component: () => DashBoard },
  { path: "/update-password/:email", name:"UpdatePassword", component: () => UpdatePassword, props: true },
  { path: "/reset-password", name:"ResetPassword", component: () => ResetPassword },
  { path: "/tutorial-display/:tutorial/:name", name:"TutorialDisplay", component: () => TutorialDisplay, props: true},
  { path: "/posts", name:"PostsIndex", component: () => PostsIndex },
  { path: "/post/:index", name:"PostView", component: () => PostView, props: true },
  { path: "/post-create", name:"PostCreate", component: () => PostCreate },
  { path: "/post-edit/:index", name:"PostEdit", component: () => PostEdit, props: true },
  { path: "/feeds", name:"FeedsIndex", component: () => FeedsIndex },
  { path: "/connection", name:"ConnectionIndex", component: () => ConnectionIndex },
  { path: "/feedback-history", name:"FeedbackHistory", component: () => FeedbackHistory },
  { path: "/detailed-analytics", name:"DetailedAnalytics", component: () => DetailedAnalytics },
  { path: "/training-pose", name:"TrainingPose", component: () => TrainingPose },
];

export default routes;

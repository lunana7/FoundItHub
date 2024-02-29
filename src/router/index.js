import Vue from "vue";
import VueRouter from "vue-router";
// Importing components for different views
import frontMain from "../views/front/frontMain.vue";
import frontIndex from "../views/front/index.vue";
import frontClaim from "../views/front/claim.vue";
import frontRevert from "../views/front/revert.vue";
import frontNav from "../views/front/nav.vue";
import frontComments from "../views/front/comments.vue";

import loginRegister from "../views/loginRegister.vue";

import userMain from "../views/user/userMain.vue";
import userInfo from "../views/user/userInfo.vue";
import userPwdEdit from "../views/user/userPwdEdit.vue";
import userClaim from "../views/user/userClaim.vue";
import userRevert from "../views/user/userRevert.vue";
import userHandleClaim from "../views/user/userHandleClaim.vue";
import userHandleRevert from "../views/user/userHandleRevert.vue";

import adminMain from "../views/admin/adminMain.vue";
import adminIndex from "../views/admin/index.vue";
import adminUserInfoManage from "../views/admin/userInfoManage.vue";
import adminManagerInfoManage from "../views/admin/managerInfoManage.vue";
import adminUserLOAManage from "../views/admin/userLOAManage";
import adminManagerLOAManage from "../views/admin/managerLOAManage";
import adminClaimManage from "../views/admin/claimManage.vue";
import adminRevertManage from "../views/admin/revertManage.vue";
import adminCommentsManage from "../views/admin/commentsManage.vue";
import adminLoginHistory from "../views/admin/loginHistory.vue";
import claimVerify from "../views/admin/claimVerify.vue";
import revertVerify from "../views/admin/revertVerify.vue";

Vue.use(VueRouter);
// Define the routes for the application

const routes = [
  {
    path: "/",
    name: "frontMain",
    component: frontMain,
    redirect: "/frontIndex",
    children: [
      // Sub-routes for the main route
      { path: "/frontIndex", name: "frontIndex", component: frontIndex },
      { path: "/frontClaim", name: "frontClaim", component: frontClaim },
      { path: "/frontRevert", name: "frontRevert", component: frontRevert },
      { path: "/frontNav", name: "frontNav", component: frontNav },
      {
        path: "/frontComments",
        name: "frontComments",
        component: frontComments,
      },
      {
        path: "/user",
        name: "user",
        component: userMain,
        beforeEnter: (to, from, next) => {
          // Check if the user is logged in before entering the user page
          if (sessionStorage.getItem("Token")) {
            next();
          } else {
            next(false);
          }
        },
        redirect: "/user/userInfo",
        children: [
          { path: "/user/userInfo", name: "userInfo", component: userInfo },
          {
            path: "/user/userPwdEdit",
            name: "userPwdEdit",
            component: userPwdEdit,
          },
          { path: "/user/userClaim", name: "userClaim", component: userClaim },
          {
            path: "/user/userRevert",
            name: "userRevert",
            component: userRevert,
          },
          {
            path: "/user/userHandleClaim",
            name: "userHandleClaim",
            component: userHandleClaim,
          },
          {
            path: "/user/userHandleRevert",
            name: "userHandleRevert",
            component: userHandleRevert,
          },
        ],
      },
    ],
  },

  {
    path: "/adminMain",
    name: "adminMain",
    component: adminMain,
    beforeEnter: (to, from, next) => {
      const identity = JSON.parse(sessionStorage.getItem("state")).identity;
      if (sessionStorage.getItem("Token") && identity != 2) {
        next();
      } else {
        next(false);
      }
    },
    redirect: "/adminIndex",
    children: [
      // Sub-routes for the user route
      { path: "/adminIndex", name: "adminIndex", component: adminIndex },
      {
        path: "/adminUserInfoManage",
        name: "adminUserInfoManage",
        component: adminUserInfoManage,
      },
      {
        path: "/adminManagerInfoManage",
        name: "adminManagerInfoManage",
        component: adminManagerInfoManage,
      },
      {
        path: "/adminUserLOAManage",
        name: "adminUserLOAManage",
        component: adminUserLOAManage,
      },
      {
        path: "/adminManagerLOAManage",
        name: "adminManagerLOAManage",
        component: adminManagerLOAManage,
      },
      {
        path: "/adminClaimManage",
        name: "adminClaimManage",
        component: adminClaimManage,
      },
      {
        path: "/adminRevertManage",
        name: "adminRevertManage",
        component: adminRevertManage,
      },
      {
        path: "/adminCommentsManage",
        name: "adminCommentsManage",
        component: adminCommentsManage,
      },
      {
        path: "/adminLoginHistory",
        name: "adminLoginHistory",
        component: adminLoginHistory,
      },
      { path: "/claimVerify", name: "claimVerify", component: claimVerify },
      { path: "/revertVerify", name: "revertVerify", component: revertVerify },
    ],
  },

  {
    path: "/loginRegister",
    name: "loginRegister",
    component: loginRegister,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

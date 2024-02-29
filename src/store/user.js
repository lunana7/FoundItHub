const user = {
  state:
    null != window.sessionStorage.getItem("state")
      ? JSON.parse(window.sessionStorage.getItem("state"))
      : {
          userInfo: {},
          userToken: "",
          userClaim: {},
          userRevert: {},
          userHandleClaim: {},
          userHandleRevert: {},
        },

  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getUserToken(state) {
      return state.userToken;
    },
    getUserClaim(state) {
      return state.userClaim;
    },
    getUserRevert(state) {
      return state.userRevert;
    },
    getUserHandleClaim(state) {
      return state.userHandleClaim;
    },
    getUserHandleRevert(state) {
      return state.userHandleRevert;
    },
  },

  mutations: {
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    updateUserToken(state, userToken) {
      state.userToken = userToken;
    },
    updateUserClaim(state, userClaim) {
      state.userClaim = userClaim;
    },
    updateUserRevert(state, userRevert) {
      state.userRevert = userRevert;
    },
    updateUserHandleClaim(state, userHandleClaim) {
      state.userHandleClaim = userHandleClaim;
    },
    updateUserHandleRevert(state, userHandleRevert) {
      state.userHandleRevert = userHandleRevert;
    },
  },

  actions: {
    asyncUpdateUserInfo(context, userInfo) {
      context.commit("updateUserInfo", userInfo);
    },
    asyncUpdateUserToken(context, userToken) {
      context.commit("updateUserToken", userToken);
    },
    asyncUpdateUserClaim(context, userClaim) {
      context.commit("updateUserClaim", userClaim);
    },
    asyncUpdateUserRevert(context, userRevert) {
      context.commit("updateUserRevert", userRevert);
    },
    asyncUpdateUserHandleClaim(context, userHandleClaim) {
      context.commit("updateUserHandleClaim", userHandleClaim);
    },
    asyncUpdateUserHandleRevert(context, userHandleRevert) {
      context.commit("updateUserHandleRevert", userHandleRevert);
    },
  },
};

export default user;

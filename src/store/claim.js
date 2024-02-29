const claim = {
  state:
    null != window.sessionStorage.getItem("claim")
      ? JSON.parse(window.sessionStorage.getItem("claim"))
      : {
          claimList: {},
        },

  getters: {
    getClaimList(state) {
      return state.claimList;
    },
  },

  mutations: {
    updateClaimList(state, claimList) {
      state.claimList = claimList;
    },
  },

  actions: {
    asyncUpdateClaimList(context, claimList) {
      context.commit("updateClaimList", claimList);
    },
  },
};

export default claim;

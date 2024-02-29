const revert = {
  // data
  state:
    window.sessionStorage.getItem("revert") !== null
      ? JSON.parse(window.sessionStorage.getItem("return"))
      : {
          revertList: {},
        },

  // The only method to get the value, computed property
  getters: {
    getRevertList(state) {
      return state.revertList;
    },
  },

  // The only method that can modify the state value, synchronous blocking
  mutations: {
    updateRevertList(state, revertList) {
      state.revertList = revertList;
    },
  },

  // Asynchronously call the mutations method
  actions: {
    asyncUpdateRevertList(context, revertList) {
      context.commit("updateRevertList", revertList);
    },
  },
};

export default revert;

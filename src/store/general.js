const general = {
  state:
    null != window.sessionStorage.getItem("general")
      ? JSON.parse(window.sessionStorage.getItem("general"))
      : {
          type: [
            { id: 1, label: "Keys", value: "Keys" },
            { id: 2, label: "Pets", value: "Pets" },
            { id: 3, label: "ID Cards", value: "ID Cards" },
            { id: 4, label: "Electronics", value: "Electronics" },
            { id: 5, label: "Cosmetics", value: "Cosmetics" },
            { id: 6, label: "Clothes", value: "Clothes" },
            { id: 7, label: "Jewelry", value: "Jewelry" },
            { id: 8, label: "Appliances", value: "Appliances" },
            { id: 9, label: "Bags", value: "Bags" },
            { id: 10, label: "Packages", value: "Packages" },
            { id: 11, label: "Books", value: "Books" },
            { id: 12, label: "Others", value: "Others" },
          ],
        },

  getters: {
    getType(state) {
      return state.type;
    },
  },

  mutations: {},

  actions: {},
};

export default general;

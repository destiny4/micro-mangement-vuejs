export default {
  namespaced: true,
  state: {
    navTree: [] // 导航菜单树
  },
  getters: {

  },
  mutations: {
    setNavTree(state, navTree) { // 设置导航菜单树
      // console.log(navTree);
      state.navTree = navTree
    }
  },
  actions: {

  }
}

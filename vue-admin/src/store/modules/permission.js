import { asyncRouterMap, constantRouterMap } from '@/router';

const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles);
  }
  return true;
};
const filterAsyncRouter = (routes, roles) => {
  const res = [];
  routes.forEach((route) => {
    const temp = { ...route };
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = filterAsyncRouter(temp.children, roles);
      }
      res.push(temp);
    }
  });
  return res;
};
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        debugger;
        const { roles } = data;
        let accessedRouters = [];
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    },
  },
};
export default permission;

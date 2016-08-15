import { routes } from './config';

const components = require.context('./components', false, /^\.\/.*\.vue$/);
const routerMap = {};
const aliasMap = {};

function capitalize(str) {
  return str.replace(/^\w/, str[0].toUpperCase());
}

routes.forEach((route) => {
  routerMap[route.path] = {
    name: route.name,
    component: components(`./${capitalize(route.abstract ? route.navs[0].name : route.name)}.vue`),
    subRoutes: {},
  };

  (route.navs || []).forEach((nav, index) => {
    if (index === 0 && route.abstract) {
      aliasMap[route.path] = `${route.path}${nav.path}`;
    }
    routerMap[route.path].subRoutes[`${nav.path}`] = {
      name: nav.name,
      component: components(`./${capitalize(route.name)}.vue`),
    };
  });
});

export function configRouter(router) {
  router.map(routerMap);
  router.alias(aliasMap);
}

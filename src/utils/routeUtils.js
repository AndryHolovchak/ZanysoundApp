const ROUTE_METHOD = { push: "push", replace: "replace" };

const SEARCH_ROUTE = "/search";
const RECOMMENDED_ROUTE = "/recommended";
const LOVED_ROUTE = "/favorites";
const PLAYLISTS_ROUTE = "/playlists";
const NOTIFICATIONS_ROUTE = "/notifications";
const PROFILE_ROUTE = "/profile";

const goToSearchRoute = (history, searchQuery, routeMethod) => {
  let url = SEARCH_ROUTE + "?q=" + encodeURIComponent(searchQuery);
  routeMethod == ROUTE_METHOD.push ? history.push(url) : history.replace(url);
};

module.exports = {
  ROUTE_METHOD,
  SEARCH_ROUTE,
  RECOMMENDED_ROUTE,
  LOVED_ROUTE,
  PLAYLISTS_ROUTE,
  NOTIFICATIONS_ROUTE,
  PROFILE_ROUTE,
  goToSearchRoute,
};

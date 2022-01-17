const listFilter = ["String", "Integer", "Boolean", "Float", "Date", "ID"];
const getRouters = (route) => [
  {
    isActive: !route,
    title: "Home",
    pathTo: "/advance",
  },
  {
    isActive: route === "add",
    title: "Add",
    pathTo: "/advance/add",
  },
  {
    isActive: route === "favorite",
    title: "Favorite",
    pathTo: "/advance/favorite",
  },
  {
    isActive: route === "setting",
    title: "Setting",
    pathTo: "/advance/setting",
  },
];
exports.listFilter = listFilter;
exports.getRouters = getRouters;

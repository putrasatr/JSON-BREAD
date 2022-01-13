const listFilter = ["String", "Integer", "Boolean", "Float", "Date", "ID"];
const routers = [
  {
    isActive: true,
    title: "Add",
    pathTo: "/advance/add",
  },
  {
    isActive: false,
    title: "Favorite",
    pathTo: "/advance/favorite",
  },
  {
    isActive: false,
    title: "Batch Edit",
    pathTo: "/advance/edit",
  },
  {
    isActive: false,
    title: "Setting",
    pathTo: "/advance/setting",
  },
];
exports.listFilter = listFilter;
exports.routers = routers;

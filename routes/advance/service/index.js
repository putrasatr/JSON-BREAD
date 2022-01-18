const { writeData } = require("../../../helpers");
const datas = require("../../../db/advance-data.json");

const addService = (data) => {
  const id = +datas.last_id + 1;
  data["id"] = id;
  datas.data.push(data);
  datas.last_id = id;
  writeData("/../db/advance-data.json", datas);
};
const deleteService = (data, id) => {
  data.data.splice(id, 1);
  writeData("/../db/advance-data.json", data);
};
const favoriteService = (data, id) => {
  const item = data.data.filter((item) => item.id === Number(id))[0];
  item.boolean = `${!JSON.parse(item.boolean)}`;
  writeData("/../db/advance-data.json", data);
};
exports.addService = addService;
exports.deleteService = deleteService;
exports.favoriteService = favoriteService;

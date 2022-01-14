const { writeData } = require("../../../helpers");
const datas = require("../../../db/advance-data.json");

const addService = (data) => {
  const id = +datas.last_id + 1;
  data["id"] = id;
  datas.data.push(data);
  datas.last_id = id;
  writeData("/../db/advance-data.json", datas);
};

exports.addService = addService;

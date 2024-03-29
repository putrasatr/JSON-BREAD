const path = require("path");
const fs = require("fs");
const { listFilter, getRouters } = require("../utils");

function getDataFiltered(data, params, paramsDate) {
  let result = [];
  const loop = (i, params) => {
    for (const key in params[0]) {
      if (key == "id") {
        i["index"] == Number(params[0]["id"]) - 1
          ? (i["status"] = true)
          : (i["status"] = false);
      } else if (!(i["status"] == false)) {
        if (key == "string") {
          let d = i[key].trim().toLowerCase();
          let f = params[0][key].trim().toLowerCase();
          if (d.includes(f)) {
            i["status"] = true;
            result.push(i);
          } else {
            i["status"] = false;
          }
        } else if (i[key] == params[0][key]) {
          i["status"] = true;
          result.push(i);
        } else {
          i["status"] = false;
        }
      }
    }
  };
  return data
    .filter((i, idx) => {
      if (paramsDate.length > 0) {
        if (paramsDate[0] <= i.date && paramsDate[1] >= i.date) {
          i["status"] == false ? (i["status"] = false) : (i["status"] = true);
        } else {
          i["status"] = false;
        }
      }
      loop(i, params);
      return result;
    })
    .filter((item) => item.status);
}

function getSortedData(data, indicator) {
  return data.map(() => {
    for (let i = 0; i < data.length; i++) {
      let j = i + 1;
      if (data[j] != undefined) {
        if (indicator == "string") {
          data[i]["string"].trim().toLowerCase() >
          data[j]["string"].trim().toLowerCase()
            ? ([data[j], data[i]] = [data[i], data[j]])
            : "";
        } else {
          data[i][indicator] > data[j][indicator]
            ? ([data[j], data[i]] = [data[i], data[j]])
            : "";
        }
      }
    }
    return data;
  });
}

function generateIndex(data) {
  return data.map((i, idx) => {
    i["index"] = idx;
  });
}

function getKasKus(n) {
  var arr = [];
  for (i = 1; i <= n; i++) {
    var hasil = i * 3;
    if (hasil % 5 === 0 && hasil % 6 === 0) arr.push("KASKUS");
    else if (hasil % 5 === 0) arr.push("KAS");
    else if (hasil % 6 === 0) arr.push("KUS");
    else arr.push(i * 3);
  }
  return arr;
}
const writeData = (filePath, data) => {
  fs.writeFileSync(
    path.join(__dirname, filePath),
    JSON.stringify(data, null, 2)
  );
};

const getFilteredData = (data, params, getById = false) => {
  let result = [];
  data.forEach((item) => {
    if (getById) {
      if (Number(item.id) === Number(params)) {
        result.push(item);
        return;
      }
    }
    for (const key in item) {
      if (
        `${item[key]}`.toLocaleLowerCase().includes(params.toLocaleLowerCase())
      ) {
        result.push(item);
        return;
      }
    }
  });
  return getById ? result[0] : result;
};
const getInitialResponse = ({ route, title }) => {
  return {
    title,
    listFilter,
    data: false,
    query: false,
    routers: getRouters(route),
  };
};
module.exports = {
  getDataFiltered,
  getSortedData,
  generateIndex,
  getKasKus,
  writeData,
  getFilteredData,
  getInitialResponse,
};

function getDataFiltered(data, params) {
    let result = []
    if ("id" in params[0]) return data[params[0]["id"]] ? [data[params[0]["id"]]] : []
    return data.filter((i, idx) => {
        i["index"] = idx
        for (const key in params[0]) {
            if (params[0][key].includes(i[key])) {
                i["status"] == false ? i["status"] = false : i["status"] = true
                result.push(i)
            } else {
                i["status"] = false
            }
        }
        return result
    }).filter(item => item.status)
}

module.exports = { getDataFiltered }
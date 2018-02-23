/**
 * Created by emol on 2/23/18.
 */
let SQLGenerator = {} = module.exports;
let fs = require('fs');
let temp = "";

SQLGenerator.gernerateSQLFile = function(data) {
    Promise.resolve(insertData(data))
        .then((temp) => {
            fs.writeFile("insert.sql", temp, function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        })
};

function insertData(data) {
    for (let type in data){
        if (!data.hasOwnProperty(type)) continue;
        temp += `-- ${type} \n`;
        for (let key in data[type]){
            if (data[type].hasOwnProperty(key) && type == "deliveryStaffs"){
                temp += insertdeliveryStaffs(data[type][key]);
            }
        }
    }
    return temp;
}



function insertdeliveryStaffs(ds) {
    let name = ds.name;
    name = name.replace(/'/g, "#");
    name = name.replace(/#/g, "''");
    return `INSERT INTO deliveryStaffs VALUES(${ds.cell_phone_number}, '${name}', '${ds.borough}');\n`;
}
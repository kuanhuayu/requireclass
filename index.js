const app = require('electron').app == undefined ? require('electron').remote.app : require('electron').app;
const fs = require('fs');
const path = require('path');

/**
 * @description 載入副檔名為 *.class.js的自訂物件
 * @param {*} fc 自訂物件名稱 'Class1','Class2' 
 */
const requiceClass = (...fc) => {
    let returnRes = {};

    let cmp = '.Class.js';
    let fi = fc.indexOf('app');
    if (fi > -1) {
        returnRes['app'] = app;
        fc.splice(fi, 1);
    }

    if (fc.length == 0) {
        return returnRes;
    }
    else {
        fc.forEach((v, index, arr) => {
            fc[index] = v + cmp;
        });
    }

    let dir = app.getAppPath();
    let list = fs.readdirSync(dir);
    list.forEach((v, index, arr) => {
        list[index] = path.join(dir, v);
    });

    let fn = undefined;
    while ((fn = list.pop()) != undefined) {
        if (fs.statSync(fn).isDirectory()) {
            fs.readdirSync(fn).forEach((v, index, arr) => {
                list.push(path.join(fn, v));
            });
        }
        else {
            // let key = path.basename(fn).replace(cmp, '');
            fc.forEach((v, index, arr) => {
                if (fn.substring((fn.length - v.length)) == v) {
                    returnRes[path.basename(fn, cmp)] = require(fn);
                    fc.splice(index, 1);
                    return false;
                }

            });
        }

    }
    return returnRes;
}

module.exports = (...fclass) => {
    return requiceClass(...fclass);
};




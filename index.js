//const app = require('electron').app == undefined ? require('electron').remote.app : require('electron').app;
const fs = require('fs');
const path = require('path');

/**
 * @description 載入副檔名為 *.class.js的自訂物件
 * @param {*} fc 自訂物件名稱 'Class1','Class2' 
 */
const requiceClass = (...fc) => {

    if (fc.length == 0) {
        return {};
    }

    let chkRenderer = () => {
        return (process && process.type == 'renderer');
    }

    let getAppPath = () => {

        // let av = process.argv;
        // for (let i = 0; i < av.length; i++) {
        //     if (av[i].indexOf('--app-path') == 0) {
        //         return av[i].substring(av[i].indexOf('=') + 1);
        //     }
        // }

        let base = process.cwd();
        if (fs.existsSync(path.join(base, 'node_modules'))) {
            return base;
        }
        // ATICaliper / ATICaliper - win32 - ia32 / resources / app / node_modules
        base = path.join(base, 'resources', 'app');
        if (fs.existsSync(path.join(base, 'node_modules'))) {
            return base;
        }
        // console.log(base, process);
        // if (process.mainModule !== undefined) {
        //     av = process.mainModule.paths;
        //     for (let i = av.length - 1; i >= 0; i--) {
        //         if (av[i].indexOf(base + path.sep) == 0) {
        //             if (fs.existsSync(av[i])) {
        //                 return path.dirname(av[i]);
        //             }
        //         }
        //     }
        // }
        return process.cwd();
    }

    let returnRes = {};
    try {
        let ele = chkRenderer() ? require('electron').remote : require('electron');
        if (typeof ele == 'object') {
            let elekey = ['BrowserView', 'BrowserWindow', 'Menu', 'MenuItem', 'Notification', 'TopLevelWindow', 'TouchBar', 'Tray',
                'View', 'WebContentsView', 'app', 'autoUpdater', 'clipboard', 'contentTracing', 'crashReporter', 'dialog',
                'globalShortcut', 'inAppPurchase', 'ipcMain', 'nativeImage', 'net', 'netLog', 'powerMonitor', 'powerSaveBlocker',
                'protocol', 'screen', 'session', 'shell', 'systemPreferences', 'webContents'];

            for (let i in fc) {
                if (elekey.indexOf(fc[i]) > -1) {
                    returnRes[fc[i]] = ele[fc[i]];
                }
            }
            if (fc.indexOf('electron') > -1) {
                returnRes['electron'] = ele;
            }
        }
    }
    catch (e) {
        console.log(e);
    }

    let cmp = '.Class.js';

    let dir = getAppPath();

    fc.forEach((v, index, arr) => {
        if (fc[index] == 'appPath') {
            returnRes['appPath'] = dir;
            fc.splice(index, 1);
        }
        else {
            fc[index] = v + cmp;
        }
    });

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
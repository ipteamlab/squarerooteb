const electron=require('electron');
const url=require('url');
const path=require('path');
const ejs=require('ejs');

const {app, BrowserWindow, Menu, ipcMain}=electron;
const {autoUpdater} = require("electron-updater");

// SET ENV
process.env.NODE_ENV='production';

let mainWindow;


app.on('ready', function(){
    //Create new window
    mainWindow = new BrowserWindow({width:1050, height: 800});
    // Load html into window
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('close', function(){
        app.quit();
        
    });
    

    // Build menu from temlate
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
    autoUpdater.checkForUpdates();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
})


// Create menu template
const mainMenuTemplate=[
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == "darwin" ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == "darwin" ? 'Command+I' : 'Ctrl+I',
                click(item, focuseWindow){
                    focuseWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
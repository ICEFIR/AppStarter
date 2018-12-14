// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let RowTemplate = JSON.parse(fs.readFileSync('rowtemplate.json'));
if(fs.existsSync('persistant.json')){
  let persistantData = JSON.parse(fs.readFileSync('persistant.json'));  
}else{
  let persistantData = {rowCounter = 0,data = {}}
}

// ./Build/linux_build.x86 -serveraddress 127.0.0.1 -port 7350 -u t1@test1.com -p abcd1234 -m

ipcMain.on("add_input_button_trigger",(event, arg) =>{
  console.log("IPC Main event triggered")
  
  persistantData.rowCounter += 1 
  event.sender.send("add_input_row", persistantData.rowCounter, RowTemplate)

})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  

  
}





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

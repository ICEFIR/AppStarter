// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs');
const path = require('path')
const { exec } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let persistantData 
let rowTemplate = JSON.parse(fs.readFileSync('rowtemplate.json'));
if(fs.existsSync('persistant.json')){
  persistantData = JSON.parse(fs.readFileSync('persistant.json'));  
}else{
  persistantData = []
}

// ./Build/linux_build.x86 -serveraddress 127.0.0.1 -port 7350 -u t1@test1.com -p abcd1234 -m

ipcMain.on("add_input_button_trigger",(event, arg) =>{
  console.log("IPC Main event triggered")
  
  event.sender.send("add_input_row", persistantData, rowTemplate)

})

ipcMain.on("persistant_data_new_row",(event,dataRow) =>{
  persistantData.push(dataRow)
})
ipcMain.on("input_data",(event,data) => {
  // console.log( "row " + data.row + " col " + data.col + " value " + data.value)
  persistantData[data.row][data.col].input = data.value
})

ipcMain.on("pop_persistant_data",(event) => {
  persistantData.pop()
  event.sender.send("refresh_rendering",persistantData,rowTemplate)
})

ipcMain.on("execute",() => {
  persistantData.forEach(element => {
    var cmd = ""
    element.forEach((e) => {
      if(e.inputType=="checkbox"){
        cmd += e.input != "" ? e.command : ""
      }else{
        cmd += e.command
      }
      
      cmd += " "
      if(e.name == "Path"){
        cmd += path.normalize(e.input)
      }
      else if(e.inputType=="checkbox"){
        
      }
      else{
        cmd += e.input
      }
      cmd += " "
      
    })
    console.log(cmd)
    exec(cmd);
  });
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
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send("refresh_rendering",persistantData,rowTemplate)
  });
  

  
}





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  fs.writeFileSync('persistant.json',JSON.stringify(persistantData))
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

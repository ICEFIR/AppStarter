const { ipcRenderer } = require('electron')

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
document.getElementById('addInputField').addEventListener('click',() => {
    console.log("Button triggered")
    ipcRenderer.send("add_input_button_trigger",'')
})




ipcRenderer.on("add_input_row",(event,rowCounter, rowSetup)=>{
    console.log("rowCounter: " + rowCounter + " ,rowSetup: " + rowSetup)
    console.log("ipc Renderer Event triggered")
    var html = ""
    const inputList = document.getElementById('inputList')
    for(i = 0; i < rowCounter;i ++){
        html+=`<div class="form-group">`
  
        rowSetup.forEach((e,i) => {
            html+=`<div class="col-1 col-sm-1">`
            html+=`<label class="form-label">  <center>` + e.commandPrefix + `<center> </label >`
            html+=`</div>`
            if(e.input == "text"){
                html+=`<div class="col-3 col-sm-3">`
                html+=` <input class="form-input" type="` + e.input + `" id="` + i + `-` + e.name + `" placeholder="` + e.name + `">`
                html+=`</div>`
            }else if(e.input == "checkbox"){
                html+=`<div class="col-3 col-sm-3">
                <label class="form-switch">`
                html+=  ` <input type="checkbox" id="` + i + `-` + e.name + `"><i class="form-icon"></i> ` + e.name
                html+=`</label>
                </div>`
            }

        })
  
        html+=`</div>`
    }

    console.log("html:" + html)
  
    inputList.innerHTML = html
  
})
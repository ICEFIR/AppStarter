const { ipcRenderer } = require('electron')

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
document.getElementById('addInputField').addEventListener('click',() => {
    // console.log("Button triggered")
    ipcRenderer.send("add_input_button_trigger")
})

document.getElementById('removeInputField').addEventListener('click',() => {
    // console.log("Button triggered")
    ipcRenderer.send("pop_persistant_data")
})

document.getElementById('execute').addEventListener('click',() => {
    // console.log("Button triggered")
    ipcRenderer.send("execute")
})

document.getElementById('inputList').addEventListener('input',(e) => {
    // console.log(e.target.value)
    var seg = e.target.id.split('-')
    var rowint = parseInt(seg[0])
    var colint = parseInt(seg[1])
    var value = e.target.value
    if(e.target.type == 'checkbox') value = e.target.checked ? "checked" : ""
    ipcRenderer.send("input_data",{row:rowint,col:colint,value})
})


ipcRenderer.on("add_input_row",(event,persistantData, rowTemplate)=>{
    // console.log("rowCounter: " + persistantData.rowCounter + " ,rowSetup: " + rowSetup)
    console.log("ipc Renderer Event triggered")
    
    
    var dataRow = []
    rowTemplate.forEach((e,ri) => {
        dataRow.push({command:e.commandPrefix,name:e.name,input:"", inputType:e.input})
    })
    persistantData.push(dataRow)
    renderInputFields(persistantData,rowTemplate)
    ipcRenderer.send("persistant_data_new_row",dataRow)
    

})

ipcRenderer.on("refresh_rendering",(event,persistantData,rowTemplate) => {
    renderInputFields(persistantData,rowTemplate)
})

function renderInputFields(persistantData,rowTemplate){
    const inputList = document.getElementById('inputList')
    var html = ""
    for(i = 0; i < persistantData.length;i ++){
        
        rowTemplate.forEach((e,ri) => {
            // if(i < persistantData.length) console.log(persistantData[i][ri].input)
            html+=`<div class="col-1 col-sm-1">`
            html+=`<label class="form-label">  <center>` + e.commandPrefix + `<center> </label >`
            html+=`</div>`
            if(e.input == "text"){
                html+=`<div class="col-3 col-sm-3">`
                html+=` <input class="form-input" `
                html+=` type="` + e.input + `" id="` + i + `-` + ri + `-` + e.name + `" `
                html+= `value ="`
                html+= persistantData[i][ri].input
                html+= `"`
                html+=` placeholder="` + e.name + `"`
                
                html+= ">"
                html+=`</div>`
            }else if(e.input == "checkbox"){
                html+=`<div class="col-3 col-sm-3">
                <label class="form-switch">`
                html+=  ` <input type="checkbox" `
                html+=  ` id="` + i + `-` + ri + `-` + e.name + `"`
                html+=  persistantData[i][ri].input != "" ? "checked" : ""
                html+= ">"
                html+=  ` <i class="form-icon"></i> ` + e.name
                html+=   `</label>
                </div>`
            }
            
        })
    }
    inputList.innerHTML = html
}
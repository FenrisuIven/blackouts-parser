import { fillTable } from "./table-constructor.js"

export let data = []
let rawData = []

export function runParser(file) {
    readFileAsText(file)
        .then((text) => extractText(text))
        .then(() => prepareData())
        .then(() => createButton())
}
export function runParserOnString(text){
    extractText(text)
    prepareData()
    fillTable()
}

function readFileAsText(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function(e) {
            resolve(e.target.result)
        }
        reader.readAsText(file)
    })
}


function prepareData() {
    if (data.length !== 0) data = []
    rawData.forEach((line) => {
        data.push(line.match(/\b\d\b/g))
    })
    console.log(data)
}

function extractText(text) {
    if (rawData.length !== 0) rawData = []
    const lines = text.split('\n');
    lines.forEach(line => {
        rawData.push(line)
    })
}

function createButton() {
    if (document.querySelector('#create-table')) return
    const btn = document.createElement('button')
    btn.textContent = 'Create Table'
    btn.addEventListener('click', () => { fillTable() })
    btn.id = 'create-table'
    
    // document.getElementById resulted in null
    const div = document.querySelector('#app')
    div.appendChild(btn)
}
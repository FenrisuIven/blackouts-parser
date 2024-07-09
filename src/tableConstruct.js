import {data} from "./parser.js"

export function firstInit(table) {
    insertHourCells(table)
    for (let i = 1; i < 7; i++) {
        const tr = table.insertRow()
        const cell = tr.insertCell()
        const span = document.createElement('span')
        span.textContent = `${i} черга`
        cell.appendChild(span)
        cell.classList.add('queue-cell')
    }
}

export function fillTable() {
    const table = document.querySelector('#blackouts-order-table')

    for (let i = 1; i < 7; i++) {
        const tr = table.rows[i]
        insertDataInCells(tr, data, i)
    }
}

function insertDataInCells(tr, data, queueNum) {
    data.forEach(currCol => {
        let td = tr.children[data.indexOf(currCol) + 1]
        if (!td) td = tr.insertCell()
        const isQueueTurnedOff = currCol.includes(queueNum.toString())
        td.style.background = isQueueTurnedOff ? 'salmon' : 'lightgray'
    })
}

function insertHourCells(table) {
    const row = table.insertRow()
    row.insertCell()
    for(let i = 1; i <= 24; i++){
        const cell = row.insertCell()
        
        let text = `${i-1}:00 - `.padStart(8,'0')
        text += `${i}:00`.padStart(5,'0')
        const span = document.createElement('span')
        span.textContent = text
        
        cell.appendChild(span)
    }
}
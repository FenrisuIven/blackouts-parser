import {data} from "./parser.js"

export function firstInit(table) {
    insertHourCells(table)
    const tr = table.rows[0]
    tr.insertCell()
    for (let i = 1; i < 7; i++) {
        const cell = tr.insertCell()
        const span = document.createElement('span')
        span.textContent = `${i} черга`
        cell.appendChild(span)
        cell.classList.add('queue-cell')
    }
}

export function fillTable() {
    const table = document.querySelector('#blackouts-order-table')

    console.log(data)
    for (let i = 1; i <= 24; i++) {
        const tr = table.rows[i]
        insertDataInCells(table, data, i)
    }
}

function insertDataInCells(table, data, hourNum) {
    let idx = 0
    for (let i = 0; i < 6; i++) {
        let cell = table.rows[hourNum][i]
        if (!cell) cell = table.rows[hourNum].insertCell()
        const isQueueTurnedOff = data[hourNum - 1][idx] === (i + 1).toString()
        
        cell.style.background = isQueueTurnedOff ? 'sandybrown' : ''
        cell.style.border = '1px solid dimgray'
        
        if (isQueueTurnedOff) {
            idx++
        }
    }
}

function insertHourCells(table) {
    table.insertRow()
    for(let i = 1; i <= 24; i++){
        const row = table.insertRow()
        const cell = row.insertCell()
        
        let text = `${i-1}:00 - `.padStart(8,'0')
        text += `${i}:00`.padStart(5,'0')
        const span = document.createElement('span')
        span.textContent = text
        span.style.width = 'max-content'

        cell.appendChild(span)
        cell.style.textAlign = 'center'
        cell.classList.add('hour-cell')
    }
}
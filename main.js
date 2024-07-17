import './style.css'
import {
     runParser, runParserOnString, firstInit, runTGParser
} from "./src"
import data from "./public/predefined-data/predefined-schedule.json"

const predefinedSchedule = data[0]
const lastUpdate = data[1]

//Configure manual update from file
document.getElementById('fileInput')
    .addEventListener('input', function(event) {
        const file = event.target.files[0]
        if (file) {
            runParser(file)
        }
    })

//Configure manual update from textarea
document.getElementById('submit-text-schedule')
    .addEventListener('click', () => {
        const textArea = document.getElementById('input-text-schedule')
        runParserOnString(textArea.value)
    })

//Configure 'Load predefined schedule' logic
document.getElementById('predefined-last-update').textContent = 'Last update: ' + lastUpdate
document.getElementById('load-predefined')
    .addEventListener('click',() => {
        //console.log(predefinedSchedule)
        runParserOnString(predefinedSchedule)
    })

//Configure 'Load from TG channel' logic
document.getElementById('load-from-tg-channel')
    .addEventListener('click', runTGParser)

//First init of schedule table
firstInit(document.getElementById('blackouts-order-table'))

document.getElementById('load-predefined').click()
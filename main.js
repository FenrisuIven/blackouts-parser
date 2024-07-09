import './style.css'
import { runParser, runParserOnString } from "./src/parser.js"
import { runTGParser } from "./src/tg-parser.js"
import { firstInit } from "./src/tableConstruct.js";
import {predefinedSchedule, lastUpdate} from "./src/predefined-schedule.js";

//Configure manual update from file
document.getElementById('fileInput')
    .addEventListener('input', function(event) {
        const file = event.target.files[0]
        if (file) {
            runParser(file)
        }
    })

//Configure 'Load predefined schedule' logic
document.getElementById('predefined-last-update').textContent = 'Last update: ' + lastUpdate
document.getElementById('load-predefined')
    .addEventListener('click',() => {
        console.log(predefinedSchedule)
        runParserOnString(predefinedSchedule)
    })

//Configure 'Load from TG channel' logic
document.getElementById('load-from-tg-channel')
    .addEventListener('click', runTGParser)

//Schedule first init
firstInit(document.getElementById('blackouts-order-table'))
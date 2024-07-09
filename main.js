import './style.css'
import { runParser } from "./src/parser.js"
import { runTGParser } from "./src/tg-parser.js"
import { firstInit } from "./src/tableConstruct.js";

document.getElementById('fileInput')
    .addEventListener('input', function(event) {
        const file = event.target.files[0]
        if (file) {
            runParser(file)
        }
    })

document.getElementById('load-from-tg-channel')
    .addEventListener('click', runTGParser)

firstInit(document.getElementById('blackouts-order-table'))
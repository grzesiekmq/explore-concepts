import { Combination } from 'js-combinatorics'
import pos from 'pos'


import { leven } from '@nlpjs/similarity'


import data from './packagesDescs.json' with {type: "json"}


console.log("before", data.descriptions);


const descriptions = data.descriptions.flatMap(el => el?.split(' ')).map(el => el?.trim().toLowerCase())


console.log(descriptions);


const array = [... new Set(descriptions.filter(el => el?.match(/^[a-z]/))
    .map(el => el.replaceAll(',', ''))
    .map(el => el.replace(/\.$/g, ''))
    .map(el => el.replaceAll('(', ''))
    .map(el => el.replaceAll(')', ''))
    .map(el => el.replaceAll(';', ''))
    .filter(el => el !== "constructor")
)]


console.log("array", array);


const words = [... new Set(new pos.Lexer().lex(array.join(' ')))]
    .map(el => el.replaceAll('.', ''))
    .sort()
    .filter(el => el.match(/^[a-z]/))


console.log("words", words);


const taggedWords = new pos.Tagger().tag(words)


console.log(taggedWords);


const nouns = [... new Set(taggedWords.filter(el => el[1] === "NN")
    .map(el => el[0])
    .map(el => el.replace(/[^a-z|*#+\d]$/g, ''))
    .sort()
    .filter(el => !el.startsWith("http://"))
    .filter(el => !el.startsWith("https://"))
)]


const obj = {}


// let it = new Combination(nouns.slice(0, 500), 2)


const results = []
function runLeven() {


    for (const pair of [...it]) {
        const distance = leven(pair[0], pair[1])
        if (distance <= 2) {


            results.push({ "distance": distance, "first": pair[0], "second": pair[1] })
        }
    }
}


// runLeven()


// console.log(results.sort((a,b) => a.distance - b.distance));


// console.log(leven("visualisation", "visualization"))


function makeToc() {
    const toc = document.getElementById('toc')
    const letters = new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));


    for (const letter of letters) {
        const p = document.createElement('p')
        const a = document.createElement("a");


        p.textContent = letter
        a.href = "#" + letter
        a.append(p)
        toc.append(a)


    }
}


// make object with arrays related to letter
// {"a":["algebra"],
//  "b":["banana"]}
function makeIndex() {


    for (const el of nouns) {


        const char = el[0].toUpperCase()


        obj[char] ??= []
        obj[char].push(el)


    }
}


makeToc()
makeIndex()


console.log(obj);


console.log(nouns, nouns.length)


function appendToHtml() {


    const ol = document.querySelector("ol");


    for (const key in obj) {


        const h1 = document.createElement('h1')
        h1.textContent = `${key} (${obj[key].length})`
        h1.id = key
        ol.append(h1)
        ol.append(document.createElement('hr'))


        for (const noun of obj[key]) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const btn = document.createElement('button')
            a.href = "http://www.google.com/search?q=" + noun;
            btn.textContent = noun;
            a.append(btn)
            li.append(a);
            ol.append(li);
        }
    }
}


appendToHtml()

const screenshot = require('desktop-screenshot')

const gm = require('gm')
const nodecr = require('nodecr')

const request = require('request')
const google = require('google')
const cheerio = require('cheerio')

const fs = require('fs')
const readline = require('readline')
const colors = require('colors')
const CFonts = require('cfonts')

console.log(colors.green("__________________________________________________________________________________"))
CFonts.say('LUCKY 13 bot', {
    font: 'simple',
    colors: ['green'],
});
console.log(colors.green("__________________________________________________________________________________"))
console.log('')
console.log(colors.yellow('Druk op de s toets om te beginnen. Druk op q om de bot te verlaten.'))
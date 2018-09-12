const screenshot = require('desktop-screenshot')

const gm = require('gm')
const tesseract = require('node-tesseract');

const request = require('request')
const google = require('google')
const cheerio = require('cheerio')

const fs = require('fs')
const readline = require('readline')
const colors = require('colors')
const CFonts = require('cfonts')

google.resultsPerPage = 25
google.lang = 'nl'
let nextCounter = 0

answerOne = ""
answerTwo = ""

pointsAnswerOne = 0
pointsAnswerTwo = 0

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q') {
        process.exit();
    }
    else if (key.name === 's') {
        console.log(colors.magenta("BOT STARTING ..."));
        bot();
    }
});

console.log(colors.green("__________________________________________________________________________________"))
CFonts.say('LUCKY 13 bot', {
    font: 'simple',
    colors: ['green'],
});
console.log(colors.green("__________________________________________________________________________________"))
console.log('')
console.log(colors.yellow('Druk op de s toets om te beginnen. Druk op q om de bot te verlaten.'))

function bot(){
    screenshot("screenshot.png", {width: 1440}, function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
            gm('./screenshot.png')
            // Width, Height, X-offset, Y-offset
            .crop(390, 170, 30, 400)
            .sepia()
            .write('./answerOne.png', function (err) {
            if (!err) 
                console.log('Answer one cropping done');
                tesseract.process(__dirname + '/answerOne.png',function(err, text) {
                    if(err) {
                        console.error(err);
                    } else {
                        answerOne = text.replace(/^\s*$[\n\r]{1,}/gm, '').toLowerCase();
                        console.log(colors.yellow("Antwoord 1 = " + answerOne.underline.yellow + ""));
                    }
                }, 'nld', 6);
            });
            gm('./screenshot.png')
            // Width, Height, X-offset, Y-offset
            .crop(390, 170, 30, 570)
            .sepia()
            .write('./answerTwo.png', function (err) {
            if (!err) 
                console.log('Answer one cropping done');
                tesseract.process(__dirname + '/answerTwo.png',function(err, text) {
                    if(err) {
                        console.error(err);
                    } else {
                        answerTwo = text.replace(/^\s*$[\n\r]{1,}/gm, '').toLowerCase();
                        console.log(colors.yellow("Antwoord 2 = " + answerTwo.underline.yellow + ""));
                    }
                }, 'nld', 6);
            });
            gm('./screenshot.png')
            // Width, Height, X-offset, Y-offset
            .crop(445, 250, 0, 140)
            .sepia()
            .write('./question.png', function (err) {
            if (!err) 
                console.log('Question cropping done');
                tesseract.process(__dirname + '/question.png',function(err, text) {
                    if(err) {
                        console.error(err);
                    } else {
                        question = text.replace(/\n/g, " ");
                        console.log(colors.yellow('De vraag is "' + question.underline.yellow + '"'));

                        google(question, function (err, res){
                            if (err) console.error(err)
                
                            for (let i = 0; i < res.links.length; ++i) {
                                let link = res.links[i];
                                if(link.link != null) {
                                    if(link.link.indexOf("wikipedia") != -1) {
                                        console.log(colors.green("Wikipedia found"));
                                        request(link.link, function (error, response, body) {
                                            if (!error) {
                                                const $ = cheerio.load(body);
                                                if($('body').text().toLowerCase().indexOf(answerOne.toLowerCase()) != -1) {
                                                    pointsAnswerOne = countInstances($('body').text().toLowerCase(), answerOne)
                                                }
                                                if($('body').text().toLowerCase().indexOf(answerTwo.toLowerCase()) != -1) {
                                                    pointsAnswerTwo = countInstances($('body').text().toLowerCase(), answerTwo)
                                                }
                                                else {
                                                    console.log("Error: " + error);
                                                }
                                            }
                                        });
                                    }
                                    if(link.title.indexOf(answerOne.toLowerCase()) != -1) {
                                        pointsAnswerOne = countInstances($('body').text().toLowerCase(), answerOne)
                                        console.log(answerOne + " found!");
                                    }
                                    if(link.description.indexOf(answerOne.toLowerCase()) != -1) {
                                        pointsAnswerOne = countInstances($('body').text().toLowerCase(), answerOne)
                                        console.log(answerOne + " found!");
                                    }
                                    if(link.title.indexOf(answerTwo.toLowerCase()) != -1) {
                                        pointsAnswerTwo = countInstances($('body').text().toLowerCase(), answerTwo)
                                        console.log(answerTwo + " found!");
                                    }
                                    if(link.description.indexOf(answerTwo.toLowerCase()) != -1) {
                                        pointsAnswerTwo = countInstances($('body').text().toLowerCase(), answerTwo)
                                        console.log(answerTwo + " found!");
                                    }
                                }
                                if(pointsAnswerOne > pointsAnswerTwo){
                                    console.log(colors.green('Het juiste antwoord is "' + answerOne + '"'));
                                }
                                if(pointsAnswerTwo > pointsAnswerOne){
                                    console.log(colors.green("Het juiste antwoord is '" + answerTwo  + "'"));
                                }
                            }
                        
                            if (nextCounter < 4) {
                                nextCounter += 1
                                if (res.next) res.next()
                            }
                        })
                    }
                }, 'nld', 6);
            });
           
    });
}

function countInstances(string, word){
    return string.split(word).length -1;
}
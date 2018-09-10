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

console.log(colors.green("__________________________________________________________________________________"))
CFonts.say('LUCKY 13 bot', {
    font: 'simple',
    colors: ['green'],
});
console.log(colors.green("__________________________________________________________________________________"))
console.log('')
console.log(colors.yellow('Druk op de s toets om te beginnen. Druk op q om de bot te verlaten.'))

function bot(){
    screenshot("screenshot.jpg", function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
            gm('./screenshot.jpg')
            // Width, Height, X-offset, Y-offset
            .crop(910, 420, 90, 800)
            .sepia()
            .write('./answerOne.jpg', function (err) {
            if (!err) 
                console.log('Answer one cropping done');
                tesseract.process(__dirname + '/answerOne.jpg',function(err, text) {
                    if(err) {
                        console.error(err);
                    } else {
                        answerOne = text.replace(/^\s*$[\n\r]{1,}/gm, '');
                        console.log(colors.yellow("Antwoord 1 = " + answerOne.underline.yellow + ""));
                    }
                }, 'nld', 6);
            });
            gm('./screenshot.jpg')
            // Width, Height, X-offset, Y-offset
            .crop(910, 420, 90, 1215)
            .sepia()
            .write('./answerTwo.jpg', function (err) {
            if (!err) 
                console.log('Answer one cropping done');
                tesseract.process(__dirname + '/answerTwo.jpg',function(err, text) {
                    if(err) {
                        console.error(err);
                    } else {
                        answerTwo = text.replace(/^\s*$[\n\r]{1,}/gm, '');
                        console.log(colors.yellow("Antwoord 2 = " + answerTwo.underline.yellow + ""));
                    }
                }, 'nld', 6);
            });
            gm('./screenshot.jpg')
            // Width, Height, X-offset, Y-offset
            .crop(1300, 650, 0, 150)
            .sepia()
            .write('./question.jpg', function (err) {
            if (!err) 
                console.log('Question cropping done');
                tesseract.process(__dirname + '/question.jpg',function(err, text) {
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
                                                pointsAnswer2 = 0;
                                                if($('body').text().toLowerCase().indexOf(answerOne.toLowerCase()) != -1) {
                                                }
                                                if($('body').text().toLowerCase().indexOf(answerTwo.toLowerCase()) != -1) {
                                                }
                                                else {
                                                    console.log("Error: " + error);
                                                }
                                            }
                                        });
                                    }else{
                                    }
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

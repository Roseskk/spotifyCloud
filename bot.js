const {Telegraf} = require('telegraf');

const ffmpeg = require('fluent-ffmpeg')
const converter = require('video-converter');
const path = require('path')
const fs = require('fs')
const youtubedl = require('youtube-dl')

const osmosis = require('osmosis');
const search = require('youtube-search');

const bot = new Telegraf('2014561680:AAELO7sNu219NZdFFQZnpBKx5RnKB-t8chI');

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('message',  async ctx =>{
    console.log(ctx.message.text)
    let result = [];
    osmosis
        .get(ctx.message.text)
        .find('title')
        .set('Song')
        .data(data =>{
            result.push(data)
            result.map(async title=>{
                let opts = {
                    maxResults: 1,
                    key: 'AIzaSyATQD748FZIsAN-tL1W-lWuoKqeESlV4k0'
                };
                search(title.Song, opts, (err, results) => {
                    if(err) return console.log(err);
                    results.map(async videoAPI=>{
                        const video1 = youtubedl(videoAPI.link,
                            ['--format=18'],
                            { cwd: __dirname })
                        video1.on('info', function(info) {
                            console.log('Download started')
                        })
                        video1.on('complete', function(info) {
                        })
                        video1.on('end', function() {
                            converter.setFfmpegPath("/usr/local/Cellar/ffmpeg/4.4_2/bin/ffmpeg", function(err) {
                                if (err) throw err;
                            });
                            converter.convert(`/Users/xxrose/Desktop/jsBot/${videoAPI.title}.mp4`, `/Users/xxrose/Desktop/jsBot/${videoAPI.title}.mp3`, function(err) {
                                if (err) throw err;
                                console.log("done");
                            });
                            ctx.replyWithAudio({ source : fs.createReadStream(`/Users/xxrose/Desktop/jsBot/${videoAPI.title}.mp3`) })
                        })
                        video1.pipe(fs.createWriteStream(`/Users/xxrose/Desktop/jsBot/${videoAPI.title}.mp4`))

                    })
                });
                    // await ctx.replyWithVideo({ source : fs.createReadStream(`/Users/xxrose/Desktop/jsBot/${_PATH}.mp4`) })
                console.log(title.Song)
            })
        })
})
bot.launch()

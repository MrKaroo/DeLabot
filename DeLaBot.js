const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql');
const youtube_dl = require('ytdl-core');
const fs = require('fs');

var dbhost = "";
var dbuser = "";
var dbpassword = "";
var dbname = "";

var clientlogin= ""; // Put discord token here

// Database connection
var con = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbname,
    multipleStatements: true
  });
con.connect();

client.on('ready', () => {
    var general = client.channels.get("308681879605739533");
    console.log(`Connecté en tant que ${client.user.tag}!`);
    console.log("Serveurs auxquels le bot est connecté:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
    });
    client.user.setActivity("trouver le respect","PLAYING"); // Change the game played by the bot
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('pong'); // Answer by mentionniong the author of the command
  }
  if (msg.content.toLowerCase().includes("incroyable")  && msg.author.id != "558040577141375047") {
    msg.channel.send('Incroyable du cul ! https://pngimage.net/wp-content/uploads/2018/06/mister-mv-png-5.png'); // Send msg without mention
  }
  // Custom Dice
  if(msg.content.toLowerCase().startsWith("!de") && msg.channel.id == "558058725596856359"){
    var numberde = msg.content.substr(3);
    if(numberde > 0 && numberde < 101 && !isNaN(numberde)){
        var resultat = dice(parseInt(numberde));
        msg.channel.send(resultat + " ! " + client.emojis.find(emoji => emoji.name === "LUL"));
        console.log("Lancer d'un dé à " + numberde + "faces par " + msg.author);
    }
    else{
        msg.channel.send("Hop hop hop " + msg.author + " ! Alors comme ça on essaie de jouer un dé à plus de 100 faces ou d'un nombre de faces impossible ? C'est pas bien ça !");
    }
  }
  // End Custom Dice

  // Shifumi
  if((msg.content.toLowerCase().startsWith("!pierre") || msg.content.toLowerCase().startsWith("!feuille") || msg.content.toLowerCase().startsWith("!ciseau")) && msg.channel.id == "558058725596856359" && msg.author.id != "558040577141375047"){
    var jeu = ["pierre","feuille","ciseau"];
    var jouer = jeu[Math.floor(Math.random()* jeu.length)];

    switch (jouer){
        case "pierre":
            if (msg.content.toLowerCase().startsWith("!pierre")){
                msg.channel.send(jouer + "! " + "Ah merde ! Égalité du cul ! Recommence !")
            }
            if (msg.content.toLowerCase().startsWith("!feuille")){
                msg.channel.send(jouer + "! " +"Ah merde ! Tu m'as rekt ! Go faire la belle !")
            }
            if (msg.content.toLowerCase().startsWith("!ciseau")){
                msg.channel.send(jouer + "! " +"HAHAHAH t'es nul ! T'es rang bronze sur Overwatch ou quoi ?")
            }
        break;
        case "feuille":
            if (msg.content.toLowerCase().startsWith("!pierre")){
                msg.channel.send(jouer + "! " +"HAHAHAH t'es nul ! T'es rang bronze sur Overwatch ou quoi ?")
            }
            if (msg.content.toLowerCase().startsWith("!feuille")){
                msg.channel.send(jouer + "! " +"Ah merde ! Égalité du cul ! Recommence !")
            }
            if (msg.content.toLowerCase().startsWith("!ciseau")){
                msg.channel.send(jouer + "! " +"Ah merde ! Tu m'as rekt ! Go faire la belle !")
            }
        break;
        case "ciseau":
            if (msg.content.toLowerCase().startsWith("!pierre")){
                msg.channel.send(jouer + "! " +"Ah merde ! Tu m'as rekt ! Go faire la belle !")
            }
            if (msg.content.toLowerCase().startsWith("!feuille")){
                msg.channel.send(jouer + "! " +"HAHAHAH t'es nul ! T'es rang bronze sur Overwatch ou quoi ?")
            }
            if (msg.content.toLowerCase().startsWith("!ciseau")){
                msg.channel.send(jouer + "! " +"Ah merde ! Égalité du cul ! Recommence !")
            }
        break;
    }
  }
  // End Shifumi

  // Random joke
  if(msg.content.toLowerCase().startsWith("!joke")){
        joke();
        console.log(" ## Demande de blague par " + msg.author.username);
  }
  // End Random Joke

  // Music player
  if(msg.content.toLowerCase().startsWith("!voice")){
      if(msg.member.voiceChannel){
        msg.member.voiceChannel.join()
            .then(voiceconn => {
                if(msg.content.includes("?t=") || msg.content.includes("&t=")){
                    console.log("## Chanson timée demandée");
                    youtube_dl(msg.content.substring(6),{begin: 90000}).pipe(fs.createWriteStream('video.mp4'));
                    setTimeout(function(){
                        var dispatcher = voiceconn.playFile("../video.mp4");
                        dispatcher.setVolume(0.15);
                    },1200);
                }
                else{
                    youtube_dl(msg.content.substring(6)).pipe(fs.createWriteStream('video.mp4'));
                    setTimeout(function(){
                        var dispatcher = voiceconn.playFile("../video.mp4");
                        dispatcher.setVolume(0.15);
                    },1200);
                }
            });
        
        if(!msg.member.voiceChannel.members.has("558040577141375047")){
            console.log(" ## Channel vocal rejoint: " + msg.member.voiceChannel.name);
        }
    }
  }
  if(msg.content.toLowerCase().startsWith("!unvoice")){
        msg.member.voiceChannel.leave();
  }
  // Change volume
  if(msg.content.toLowerCase().startsWith('!vlm')){
      msg.member.voiceChannel.connection.dispatcher.setVolume(msg.content.substring(4));
  }
});
// End Music Player

client.on("presenceUpdate", update => {
    
    // console.log(update.user.presence.game.name); // Get the game launched by user
    // console.log(update.user.username); // Get user that launched a game

    if(update.user.presence.game){
        if(update.user.presence.game.name.toLowerCase() == "sea of thieves"){
            var chan = client.channels.get("558058725596856359");
            chan.send("Putain, " + update.user.username + " fait le pirate du cul sur " + update.user.presence.game.name + " !\nhttps://youtu.be/gEavew0rHT0?t=9");
            console.log("## " + update.user.username + " a commencé à jouer à Sea of Thieves");
        }
    }
});

function dice(number){
    var valde = [];
    for(var i = 1; i < number + 1; i++){
        valde.push(i);
    }
    var jouerde = valde[Math.floor(Math.random() * valde.length)];
    return jouerde;
}

function joke(){
    var nbBlagues = "SELECT MAX(Id_Blague) as Id_Blague FROM Blague";
    con.query(nbBlagues, function(err, rows, fields){
        if(err) throw err;
        var blague = "SELECT Blague FROM Blague WHERE Id_Blague = ";
        con.query(blague + Math.floor(Math.random() * parseInt(rows[0].Id_Blague) + 1), function(err, rows1, fields){
            if(err) throw err;
            blague = rows1[0].Blague
            var chan = client.channels.get("558058725596856359");
            chan.send(blague + " " + client.emojis.find(emoji => emoji.name === "LUL"));
        });
    });
}

client.login(clientlogin);
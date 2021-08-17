console.log("hello")
// var msgPrev = ""
// var msgDiv = document.querySelector("div.y8WcF > div:last-child > div > div > div > div.copyable-text > div > span.i0jNr.selectable-text.copyable-text > span")
// if(msgDiv){
//     msgPrev = msgDiv.innerText
// }

// setInterval(function(){
//     console.log("cool")
//     try{
//         var msg = (document.querySelector("div.y8WcF > div:last-child > div > div > div > div.copyable-text > div > span.i0jNr.selectable-text.copyable-text > span")).innerText;
//         console.log(msg);
//     }
//     catch(e){
//         console.log(e);
//     }
// },500)
var msg = null;
var btn = null;
var head = null;
var completeChat = null
var trueMsg = null
var audioToPlay = ""
var audioPlaying = ""
var audio = null
// in case of reload
var lastCommand = localStorage.getItem("lastCommandSudoic")
var lastPlayedSudoic = localStorage.getItem("lastPlayedSudoic")
console.log(lastCommand, lastPlayedSudoic)

const playAudio = async (newSong) => {
    if(audioPlaying != newSong && newSong != lastPlayedSudoic){
        audioPlaying = newSong;
        console.log(audioPlaying, lastCommand)
        lastCommand = "play"
        localStorage.setItem("lastCommandSudoic","play")
        localStorage.setItem("lastPlayedSudoic",audioPlaying)
        var url = ""
        if(audioPlaying.includes("youtube.com") || audioPlaying.includes("youtu.be")){
            url = await fetch("https://sudoic.herokuapp.com/sudoic/url",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors',
                body: JSON.stringify({query : audioPlaying})
            }).then(res => res.json())
            console.log("from url")
        }else{
            url = await fetch("https://sudoic.herokuapp.com/sudoic",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors',
                body: JSON.stringify({query : audioPlaying + " lyrics"})
            }).then(res => res.json())
        }
        console.log(url.data)
        chrome.runtime.sendMessage({url : url.data, command : "play"})
    }
}

const playList = async (newSong) => {
    if(audioPlaying != newSong && newSong != lastPlayedSudoic){
        audioPlaying = newSong;
        console.log(audioPlaying)
        lastCommand = "playlist"
        localStorage.setItem("lastCommandSudoic","playlist")
        localStorage.setItem("lastPlayedSudoic",audioPlaying)
        
        try{
            const urlIds = await fetch("https://sudoic.herokuapp.com/sudoic/playlist",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors',
                body: JSON.stringify({query : audioPlaying})
            }).then(res => res.json())
            console.log(urlIds.data, urlIds.firstAudio)    
            chrome.runtime.sendMessage({url : urlIds.firstAudio, ids : urlIds.data, command : "playlist"})
        }catch(err){
            console.log("The playlist doesn't exist or is private")
        }
    }
}


const pauseAudio = () => {
    if(lastCommand != "pause"){
        chrome.runtime.sendMessage({command : "pause"})
        localStorage.setItem("lastCommandSudoic","pause")
        lastCommand = "pause"
    }
}

const skipAudio = () => {
    if(lastCommand != "skip"){
        chrome.runtime.sendMessage({command : "skip"})
        localStorage.setItem("lastCommandSudoic","skip")
        lastCommand = "skip"
    }
}

const skipAudio2 = () => {
    if(lastCommand != "skip2"){
        chrome.runtime.sendMessage({command : "skip2"})
        localStorage.setItem("lastCommandSudoic","skip2")
        lastCommand = "skip2"
    }
}

const resumeAudio = () => {
    if(lastCommand != "resume"){
        chrome.runtime.sendMessage({command : "resume"})
        localStorage.setItem("lastCommandSudoic","resume")
        lastCommand = "resume"
    }
}

const stopAudio = () => {
    audioPlaying = ""
    if(lastCommand != "stop"){
        chrome.runtime.sendMessage({command : "stop"})
        localStorage.setItem("lastCommandSudoic","stop")
        lastCommand = "stop"
    }
}

const main = setInterval(() => {
    // head = document.querySelector("div.YtmXM")
    head = document.querySelector("#side > header > div._3yZPA > div > span")
    completeChat = document.querySelector("#app > div._1ADa8._3Nsgw.app-wrapper-web.font-fix.os-win > div._1XkO3.two > div.ldL67._3sh5K")
    if(head && completeChat){
        clearInterval(main)
        const activateBtn = document.createElement("button");
        activateBtn.innerText = "on"
        activateBtn.onclick = function(){chrome.runtime.sendMessage({command : "open"})}
        activateBtn.id = "activate-btn"
        // activateBtn.style.backgroundImage = "url('logo128.png')"
        activateBtn.style.display = "inline-block !important"
        activateBtn.style.margin = "0px"
        activateBtn.style.color = "white"
        activateBtn.style.fontFamily = "verdana"
        activateBtn.style.width = "37px"
        activateBtn.style.height = "37px"
        activateBtn.style.backgroundColor = "rgb(38,41,45)"
        activateBtn.style.border = "2px rgb(10, 13, 16) solid"
        activateBtn.style.borderRadius = "20px"
        // activateBtn.style.onmouseover = function(){
        //     this.style.transform = "translate"
        //     // this.style.fontFamily = "verdana"
        // }
        activateBtn.addEventListener("click", function(){
            console.log("hehe")
            console.log(this)
        })
        head.appendChild(activateBtn);
        completeChat.addEventListener("DOMSubtreeModified", function(){
            msg = document.querySelector("div.y8WcF > div:last-child > div > div > div > div.copyable-text > div > span.i0jNr.selectable-text.copyable-text > span")
            if(msg){
                msg.innerText.substring(1,5)
                if(msg.innerText[0] === "?"){ 
                    trueMsg = msg.innerText.split(" ")
                    console.log(trueMsg)
                    switch(trueMsg[0]){
                        case "?play": {
                            audioToPlay = trueMsg.slice(1,trueMsg.length).join(" ");
                            console.log(audioToPlay);
                            if(audioToPlay.includes("www.youtube.com/playlist?list=")){
                                playList(audioToPlay)
                                console.log("Playlist by play command")
                                break
                            }
                            if(audioToPlay.trim().length){
                                playAudio(audioToPlay);
                            }    
                            break;
                        }
                        case "?p": {
                            audioToPlay = trueMsg.slice(1,trueMsg.length).join(" ");
                            console.log(audioToPlay);
                            if(audioToPlay.includes("www.youtube.com/playlist?list=")){
                                playList(audioToPlay)
                                console.log("Playlist by p command")
                                break
                            }
                            if(audioToPlay.trim().length){
                                playAudio(audioToPlay);
                            }
                            break;
                        }
                        case "?v": {
                            pauseAudio();
                            break
                        }
                        case "?r": {
                            resumeAudio();
                            break
                        }
                        case "?stop": {
                            stopAudio();
                            break
                        }
                        case "?pl": {
                            audioToPlay = trueMsg.slice(1,trueMsg.length).join(" ");
                            console.log(audioToPlay);
                            playList(audioToPlay);
                            break;
                        }
                        case "?s":{
                            skipAudio();
                            break
                        }
                        case "?fs":{
                            skipAudio2();
                            break
                        }
                        default : {
                            // stopAudio();
                            break
                        }
                    }
                }   
            }  
        })
    }
},500)
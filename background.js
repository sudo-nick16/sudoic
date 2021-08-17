console.log("nikit")
var audio = document.createElement("audio");
var dummy = document.createElement("audio");
var playlist = []
var curr = 0;
var flag = true
audio.volume = 1
var audioPromise = null

audio.addEventListener("ended", ()=>{
    console.log(playlist, curr)
    if(curr < playlist.length){
        curr++;
        if(curr == playlist.length){
            curr = 0;
            playlist = [];
        }else{
            playAudio();
        }
    }
})

const initializePlaylist = async (ids) => {
    if(flag){
        for(let i = 1; i < ids.length; i++){
            const url = await fetch("https://sudoic.herokuapp.com/sudoic/url",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors',
                body: JSON.stringify({query : `https://www.youtube.com/watch?v=${ids[i]}`})
            }).then(res => res.json())
            console.log(url.data)
            playlist.push(url.data)
        }
    }
}

const playAudio = () => {
    audio.src = playlist[curr];
    audioPromise = audio.play();
    if(audioPromise !== undefined){
        audioPromise.then(()=>{
            console.log("playing..")
        }).catch(()=>{
            curr++;
            if(curr < playlist.length){
                playAudio();
            }
            console.log("error")
        })
    } 
}

const playSingleAudio = () => {
    if(playlist.length < 2){
        console.log(playlist)
        dummy.src = playlist[curr];
        audio.src = playlist[curr];
        audioPromise = audio.play();
        if(audioPromise !== undefined){
            audioPromise.then(()=>{
                console.log("playing..")
            }).catch(()=>{
                playlist.shift();
                console.log("error")
            })
        } 
    }
}

chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
    console.log(res)

    if(res.command === "open"){
        window.open('./index.html')
    }else if(res.command === "playlist"){
        console.log("playlist")
        playlist = []
        curr = 0
        playlist.push(res.url)
        playAudio()
        ids = JSON.parse(res.ids)
        initializePlaylist(ids)
    }else if(res.command === "skip" || res.command === "skip2"){
        if(curr < playlist.length - 1){
            curr++;
            dummy.src = playlist[curr]
            playAudio();
        }else{
            audio.src = ""
            curr = 0;
            playlist = [];
        }
    }else if(res.command === 'resume'){
            audioPromise = audio.play();
            if(audioPromise !== undefined){
                audioPromise.then(()=>{
                    console.log("success")
                }).catch(()=>{
                    console.log("error")
                })
            } 
    }else if(res.command === 'play'){
            playlist.push(res.url)
            playSingleAudio()
            console.log(playlist)
    }else if(res.command === 'pause'){
            audio.pause();
    }else{
        flag = false
        audio.src= "";
        dummy.src= "";
        playlist = [];
        curr = 0;
    }
})
const colorsChoice = document.querySelector('#colorsChoice')
const game = document.querySelector('#game')
const cursor = document.querySelector('#cursor')
game.width = 1200
game.height = 600
const gridCellSize = 10 


const date = new Date();
const options = { timeZone: 'Europe/Paris' };
const time = new Intl.DateTimeFormat('fr-FR', options).format(date);
console.log(time); // affiche l'heure actuelle à Paris au format 'jj/mm/aaaa, hh:mm:ss'


const timeLimit = 5 * 60 * 1000; // 5 minutes en millisecondes



const ctx = game.getContext('2d');
const gridCtx = game.getContext('2d');
const colorList =[
    "#FFEBEE", "#FCE4EC", "#F3E5F5", "#B39DD8", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA",
    "#4DB6AC", "#66886A", "#9CCC65", "#CDDC39", "#FFEB38", "#FFC107", "#FF9800", "#FF5722",
    "#A1887F", "#E0E0E0", "#90A4AE", "#000"
]

let currentColorChoice = colorList[0]

const firebaseConfig = {
    apiKey: "AIzaSyDokruBNvsK1OHD2Oc1-eNN8ndD2Qm77HA",
    authDomain: "pixel-war-b21fb.firebaseapp.com",
    projectId: "pixel-war-b21fb",
    storageBucket: "pixel-war-b21fb.appspot.com",
    messagingSenderId: "493300094191",
    appId: "1:493300094191:web:60e39fd7b47f67bc0f771a",
    measurementId: "G-3J959V349F"
  };
    firebase.initializeApp(firebaseConfig)
    const db = firebase.firestore()


colorList.forEach(color =>{
    const colorItem =document.createElement('div')
    colorItem.style.backgroundColor = color
    colorsChoice.appendChild(colorItem)
    colorItem.addEventListener('click', () => {
        currentColorChoice  = color

        colorItem.innerHTML = '<i class="fa-solid fa-check"></i>'

        setTimeout(() =>{
            colorItem.innerHTML =""
        }, 1000)
    })
})




function createPixel(x, y, color){
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, gridCellSize, gridCellSize)
}
function timeIsUp() {
    alert("La durée limite de 5 minutes est écoulée !");
}

function addPixelIntoGame(){
    // Vérifier si la durée de 5 minutes est écoulée ou non
    const currentTime = new Date().getTime();
    const myVar = sessionStorage.getItem('myVar');

    let startTime=myVar
    if (startTime==0 || currentTime - startTime >= timeLimit) {
        alert("La durée limite de 5 minutes est écoulée !");
    }
    else{
        return;
    }
    // Continuer à ajouter les pixels
    const x = cursor.offsetLeft
    const y =cursor.offsetTop- game.offsetTop

    createPixel(x, y, currentColorChoice)
    ctx.beginPath()
    ctx.fillStyle = currentColorChoice 
    ctx.fillRect(x, y, gridCellSize, gridCellSize)

    const pixel = {
        x,
        y,
        color: currentColorChoice
    }
    
    const pixelRef = db.collection('pixel').doc(`${pixel.x}-${pixel.y}`)
    pixelRef.set(pixel, {merge : true})
    sessionStorage.setItem('myVar', currentTime);

    }




cursor.addEventListener('click',function(event){
    addPixelIntoGame()
})  

game.addEventListener('click', function(){
    addPixelIntoGame()
})

function drawGrids(ctx, width, height, cellWidth, cellHeight){
    ctx.beginPath()
    ctx.strokeStyle="#ccc"

    for(let i = 0; i<width; i++){
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
    }

    for(let i = 0; i<height; i++){
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
    }
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function(event){
    

    const cursorLeft = event.clientX -(cursor.offsetWidth/2)
    const cursorTop = event.clientY  - (cursor.offsetHeight/2)

    cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px"
    cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px"

})
    
db.collection('pixel').onSnapshot(function (querySnapshot){
    querySnapshot.docChanges().forEach(function (change){
        const{x, y, color}=change.doc.data()

        createPixel(x, y, color)
    })
})
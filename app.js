const time_element = document.getElementById("time");
const date_element = document.getElementById("date");
const message_body = document.getElementById("message_body");
const wallpaper_section = document.getElementById("wallpaper_section");
const search_form = document.getElementById("search_form");

function number_2_text(number){ //this just checks the number and attaches a '0' before it if its less than 10
    return `${number < 10? '0': ''}${number}`;
}

//DATE-TIME CHANGE LOGIC --------------------
previousMinute = 0;

//update the time on load
function updateDateTime(currentDate = new Date()){
    const date = currentDate.getDate();
    const month = currentDate.toLocaleString("en-US", { month: "short" });
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    previousMinute = minutes;

    date_element.innerHTML = `${number_2_text(date)} ${month}, ${year}`;
    time_element.innerHTML = `${number_2_text(hour)}:${number_2_text(minutes)}`;
}
updateDateTime();

//update the time every minute
setInterval(()=>{
    currentDate = new Date();
    currentMinute = currentDate.getMinutes();
    if(currentMinute != previousMinute){//check if the minutes has changed
        updateDateTime(currentDate);//update rendered date-time
    }
}, 100)

//MESSAGE CHANGE LOGIC --------------------
async function getMessages(){
    const response = await fetch("./assets/data/messages.json");
    const data = await response.json();
    return data;
}

async function showMessages(){
    const messages  = await getMessages()

    let message_ID = 0
    setInterval(() => {
        //create a new one with the current message
        const text_el = document.createElement("p");
        text_el.innerHTML = messages[message_ID].message;
        text_el.classList.add("other_messages")
        message_body.replaceChild(text_el, message_body.firstElementChild); //mount the new message

        message_ID = message_ID < messages.length - 1? message_ID += 1 : 0; //change ID
    }, 3000); //cycle through each message every second
}
showMessages();

//WALLPAPER CHANGE LOGIC --------------------
async function getWallpapersList(){
    const response = await fetch("./assets/data/wallpapers.json");
    const wp_list = await response.json();
    return wp_list;
}

function setWallpaper(url){
    const img_el = document.createElement("img");
    img_el.src = url;
    img_el.id = "wallpaper";
    img_el.classList.add("wallpaper");
    wallpaper_section.replaceChild(img_el, wallpaper_section.firstElementChild); //replace the current image
}

async function changeWallpaper(){
    const wp_list = await getWallpapersList();
    
    let curr_wp_id = parseInt(localStorage.getItem("current_wp")) || 0; //get current wallpaper ID from memory

    setWallpaper(wp_list[curr_wp_id].url)

    curr_wp_id = curr_wp_id < wp_list.length - 1? curr_wp_id + 1 : 0; //set the next image ID
    localStorage.setItem("current_wp", curr_wp_id) //save next image id in memory

    //Slideshow cycling through the wallpapers (WIP - need to find a way to preload the images to eliminate the white-flash effect that happens when the image element is mounted while the image is still loading)
    // const wallpaper_delay = 60; //in seconds
    // if(wp_list.length > 1){//we will only cycle through the images if there is more than 1 wall paper
    //     setInterval(() => {
    //         changeWallpaper(wp_list[next_wp_id].url);
    //         current_wp_id = current_wp_id < wp_list.length - 1? current_wp_id += 1 : 0; //change ID
    //         localStorage.setItem("current_wp", current_wp_id) //save current image id in memory
    //     }, wallpaper_delay * 1000); //cycle through each image
    // }
}
changeWallpaper();

//SEARCH LOGIC --------------------
function handleSearch(event){
    event.preventDefault();
    formData = new FormData(event.target) //get form data

    urlParams = new URLSearchParams()
    urlParams.append("q", formData.get("search_text")) //Google uses query param key "q" as the key for the search text

    searchURL = `https://www.google.com/search?${urlParams.toString()}` //the URLParams class will be used to convert the data to URL query param string.
    location.href = searchURL; //replace current tab URL to search google
}

search_form.addEventListener("submit",handleSearch)
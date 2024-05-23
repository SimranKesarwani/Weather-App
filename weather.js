const userTab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const usercontainer=document.querySelector(".weather-container");

const grantAcessContainer=document.querySelector(".grant-loaction-container");
const searchform=document.querySelector(".form-container");
const loadingcontainer=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");

//initially variables need
const API="13a67c418e1bd3f4a25a05051ee1cb56";

let currTab=userTab;
currTab.classList.add("curr-tab");
getFromSessionStorage();

function switchtab(clickedtab){
    if(clickedtab!=currTab){
        //switch kro tb
        currTab.classList.remove("curr-tab");
        currTab=clickedtab;
        currTab.classList.add("curr-tab");
    
        if(!searchform.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            //search se yourweather pr jaa rhe h
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active"); 
            getFromSessionStorage(); //mtlb curr loca ke cord lekr weather show kro
        }
    }

}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input
    switchtab(userTab);
});

searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
    //hm jis tab me click kr rhe wo tab pass krenge
});

function getFromSessionStorage(){
    //check krega if we had location cordinate of user
    const localCord=sessionStorage.getItem("user-coordinates");

    if(!localCord){
        //local cord nhi presnet h
        grantAcessContainer.classList.add("active");
    }
    else{
        //store hai
        const cord=JSON.parse(localCord);
        fetchUserWeatherInfo(cord);
    }
}

async function fetchUserWeatherInfo(cord){
    const {lat,lon}=cord;
    //make grant con invisible
    grantAcessContainer.classList.remove("active");
    loadingcontainer.classList.add("active");

    //API CALL
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        const data= await response.json();

        //loader htao
        loadingcontainer.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingcontainer.classList.remove("active");
        window.alert("cannot fetch data");
    }
}

function renderWeatherInfo(weatherobject){
    //firstly we have to fetch elements where data needs to be insert to display in ui

    const city=document.querySelector("[data-city-name]");
    const countryicon=document.querySelector("[data-countryicon]");
    const decsp=document.querySelector("[data-weatherdesc]");
    const weathericon= document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //now fetch data from api call returned object
    //put in ui elements
    city.innerText=weatherobject?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherobject?.sys?.country.toLowerCase()}.png`;
    decsp.innerText=weatherobject?.weather?.[0]?.description;
    weathericon.src=`https://openweathermap.org/img/wn/${weatherobject?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherobject?.main?.temp} °C`;
    windspeed.innerText=`${weatherobject?.wind?.speed} m/s`;
    humidity.innerText=`${weatherobject?.main?.humidity} %`;
    cloudiness.innerText=`${weatherobject?.clouds?.all} %`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        //show an alert for no geolocation available

    }
}

function showPosition(position){
    const userCord={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCord));
    fetchUserWeatherInfo(userCord);

}

const grantAccessButton=document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);

const searchinput=document.querySelector("[data-searchinput]");

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;

    if(cityname===""){
        return;
    }
    else{
        console.log("inside search");
        fetchSearchWeatherInfo(cityname);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingcontainer.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        const data= await response.json();

        //loader htao
        loadingcontainer.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(e){
        //alert show kro
        window.alert("cannot fetch data");
    }
}

















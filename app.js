window.addEventListener(`load`, () => {
    // Hittar din position long ,lat
    let long;
    let lat;
    let tempertureDescription = document.querySelector(".temperture-description");
    let tempertureDegree = document.querySelector(".temperture-degree");
    let locationTimezone = document.querySelector(".location-timzone");
    let tempertureSection = document.querySelector(".temperture");

    const tempertureSpan = document.querySelector(".temperture span" );
    const searchBar = document.getElementById("searchBar");


    searchBar.addEventListener("keyup", (e) => {
        console.log(e.target.value);

    });
    
    

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;


            const proxy = "https://cors-anywhere.herokuapp.com/";
            const api =`${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
try {

    fetch(api)
                 .then(response => {
                     return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        //Set the DOM elememt from the api
                        const { temperature, summary, icon } = data.currently;
                        tempertureDegree.textContent = temperature;
                        tempertureDescription.textContent = summary;
                        locationTimezone.textContent = data.timezone;
                        //Forumla from celsius
                        let celsius = (temperature - 32) * (5 / 9)
                         //Set icon
                         setIcons(icon, document.querySelector(".icon")); 
                         tempertureSection.addEventListener("click", () => {
                             if (tempertureSpan.textContent === "F°") {
                                 tempertureSpan.textContent = "C°";
                                 tempertureDegree.textContent = Math.floor(celsius);
                                } else {
                                 tempertureSpan.textContent = "F°";
                                 tempertureDegree.textContent = temperature;

                             }

                         });

                        

                    });
           
    
} catch (error) {
    console.log(error)
    
}
            
        });
        
    }
function setIcons(icon, iconID){
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);


}
});
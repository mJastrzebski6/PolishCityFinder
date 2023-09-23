class CityFinder{
    constructor(){
        this.loadCities();
        this.cityInput = document.getElementById("city-input");
        this.matchedCities = document.getElementById("matched-cities");
        this.searchButton = document.getElementById("search-button");

        this.cityInput.addEventListener("input", () => this.matchingAutocomplete(this.cityInput.value));
        this.cityInput.addEventListener("click", () => this.matchingAutocomplete(this.cityInput.value));
        this.searchButton.addEventListener("click",()=>this.searchByConditions());
        document.addEventListener("click", () => this.matchedCities.innerHTML = '', true);
    }

    async loadCities(){
        const response = await fetch('./citiesPl.json');
        this.citiesObject = await response.json();
    }

    matchingAutocomplete(searchText){
        let matches = this.citiesObject.filter(city => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return city.name.match(regex);
        })
        if(searchText.length === 0 ){
            matches = [];
            this.matchedCities.innerHTML = '';
        }
        this.displayAutocompletion(matches.slice(0, 5));  // display only 5
    }

    displayAutocompletion(matches){
        if(matches.length > 0){
            const html = matches.map(
                match => `<div class="border-bottom border-left border-right rounded ">
                    <h4 class="pt-1 pl-1" onclick="(()=>CityFinder.changeCity('${match.name}'))();">${match.name}</h4>
                </div>`
            ).join('');
            this.matchedCities.innerHTML = html;
        }
        else this.matchedCities.innerHTML = '';
    }

    static changeCity(city){
        document.getElementById("city-input").value=city;
        document.getElementById("found-list").innerHTML = "";
    }

    searchByConditions(){
        document.getElementById("found-list").innerHTML = "";

        const city = document.getElementById("city-input").value;
        const found = this.citiesObject.find(element => element.name == city);
        if (found === undefined){
            document.getElementById("found-list").innerHTML = '<div class="mb-5 mt-3 col-md-12 text-center">Brak wyników</div>';
            return;
        }

        const radius = document.getElementById("number-input").value;
        if (radius == ""){
            document.getElementById("found-list").innerHTML = '<div class="mb-5 mt-3 col-md-12 text-center">Zła wartość promienia</div>';
            return;
        }

        let match ="";
        let distance = 0;
        this.citiesObject.sort((a,b) => a.name.localeCompare(b.name));
        for(let i=0; i<this.citiesObject.length; i++){
            if(found.name == this.citiesObject[i].name) continue;
            distance = this.calculateDistance(found.lat, found.lng, this.citiesObject[i].lat, this.citiesObject[i].lng);
            if(distance < radius){
                match += `<div class="col-md-4 m-auto"><div class="card card-body my-1">
                    <h6>${this.citiesObject[i].name}</h6>
                    <h6>${Math.floor(distance* 100)/100}km</h6>
                </div></div>`;
            }
        }
        document.getElementById("found-list").innerHTML = match+'<div class="mb-5 mt-3 col-md-12 text-center">To już wszystko :)</div>';  
    }

    calculateDistance(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo){
        return Math.sqrt(Math.pow(latitudeFrom-latitudeTo, 2) + Math.pow(longitudeFrom-longitudeTo, 2))*73;
    }
}

const client = new CityFinder();
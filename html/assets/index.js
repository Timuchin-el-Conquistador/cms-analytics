//date
const analyticsStart = document.getElementById("start-date");
const analyticsEnd = document.getElementById("end-date");

//player
const player = document.getElementById("player");

//observations
const observations = document.getElementById('observations')

//querying dates
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const playerUid = urlParams.get("playerUid");
const playerName = urlParams.get("playerName");

//date
const start = urlParams.get("startDate");
const end = urlParams.get("endDate");



fetch(
  `https://stagingapp.murmurcars.com/api/v1/cms/analytics/player/${playerUid}?startDate=${start}&endDate=${end}`
)
  .then((response) => response.json())
  .then((data) => {
    const { analytics } = data;

    for(let analytic in analytics){
   
        const observation = document.createElement('tr')
        observation.classList.add('analytics__observation')
  
        const {slide,count,cumilatedDuration} = analytics[analytic]
        //console.log(slide.split('https://backendapp.murmurcars.com/advertisers/cms/'))

        if(slide === undefined) continue
        const slideFeature = document.createElement('td')
        const countFeature = document.createElement('td')
        const durationFeature = document.createElement('td')

        const linkSlide = document.createElement('a')
        linkSlide.target = '_blank'
        linkSlide.href = analytic
        linkSlide.innerHTML = slide.split('Download/')[1]

        slideFeature.appendChild(linkSlide)
        countFeature.innerHTML = count
        durationFeature.innerHTML = cumilatedDuration
        

        observation.appendChild(slideFeature)
        observation.appendChild(countFeature)
        observation.appendChild(durationFeature)
        observations.appendChild(observation)
    }
      
    //dates
    analyticsStart.innerHTML = start;
    analyticsEnd.innerHTML = end;

    //player
    player.innerHTML = playerName + " " + "(UID: " +  playerUid + ')';

  });

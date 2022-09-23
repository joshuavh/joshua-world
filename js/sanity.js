//Sanity
let PROJECT_ID = "jidqpryp";
let DATASET = "production";
let QUERY = encodeURIComponent('*[_type == "project"] | order(order asc)');

let URL = `https://${PROJECT_ID}.api.sanity.io/v2022-07-11/data/query/${DATASET}?query=${QUERY}`;


// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {

   //console.log(result);

    let modal = document.getElementsByClassName("modal-content-wrapper"); 
    let thumbnail = document.getElementsByClassName("thumbnail");
    let header = document.getElementsByClassName("header");
    let projecttitles = document.getElementsByClassName("projecttitle");
    let subtitles = document.getElementsByClassName("subtitle");
    let headline = document.getElementsByClassName("projectheadline");
    let modal_subtitles = document.getElementsByClassName("modal-subtitle");

    for (let i = 0; i < result.length; i++) {
        thumbnail[i].src = "https://cdn.sanity.io/images/jidqpryp/production/" + result[i].thumbnail.asset._ref.substring(6, result[i].thumbnail.asset._ref.length-4) + ".jpg";
        header[i].style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0, 0.2), rgba(0,0,0, 1)), url(https://cdn.sanity.io/images/jidqpryp/production/' + result[i].herobanner.asset._ref.substring(6, result[i].herobanner.asset._ref.length-4) + '.jpg)';
        projecttitles[i].textContent = result[i].title;
        subtitles[i].textContent = result[i].subtitle;
        headline[i].textContent = result[i].title;
        modal_subtitles[i].textContent = result[i].subtitle;
        for (let b = 0; b < result[i].sections.length; b++ ){
            if (result[i].sections[b]._type == 'subheadline'){
                modal[i].innerHTML += '<h1>' + result[i].sections[b].input + '</h1>';
            }
            if (result[i].sections[b]._type == 'text-field'){
                modal[i].innerHTML += '<p2>' + result[i].sections[b].input + '</p2>';
            }
            if (result[i].sections[b]._type == "product-image"){
                let newImg = document.createElement('img');
                newImg.classList.add('project-img');
                newImg.src = "https://cdn.sanity.io/images/jidqpryp/production/" + result[i].sections[b].asset._ref.substring(6, result[i].sections[b].asset._ref.length-4) + ".jpg";
                modal[i].appendChild(newImg);
            }
        }
        let credits = document.createElement('div');
        credits.classList.add('credits');
        modal[i].appendChild(credits);
        for (let a = 0; a < result[i].credits.length; a++ ){
            let newCredit = document.createElement('p');
            newCredit.classList.add('credit');
            newCredit.textContent = result[i].credits[a];
            credits.appendChild(newCredit);
        }
    }

  })

.catch((err) => console.error(err));
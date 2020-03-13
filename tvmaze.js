const MISSING_IMAGE_URL =
  'https://www.google.com/url?sa=i&url=http%3A%2F%2Fclipart-library.com%2Fquestion-marks.html&psig=AOvVaw1cVl9eHryJLBC5XGcppvhL&ust=1584149768107000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPib4_enlugCFQAAAAAdAAAAABAD';

async function searchShows(query) {
  // 'query' IS USED AS A PARAMETER IN THIS FUNCTION
  // TODO: Make an ajax request to the searchShows api.
  const res = await axios.get('http://api.tvmaze.com/search/shows/', { params: { q: query } });

  // loop over each object in the API's data's array structure
  const showData = res.data.map(element => {
    // set each object within the array to a varaible
    let show = element.show;

    // return needed data from the object, as an object
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL
    };
  });
  return showData;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(showData) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of showData) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let showData = await searchShows(query);

  populateShows(showData);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(res);
  const epData = res.data.map(element => {
    // the id's that we want isn't in any further data structures, so we can just drag out the id
    // **unlike the searchShows fn**
    return {
      id: element.id,
      name: element.name,
      season: element.season,
      number: element.number
    };
  });
  return epData;
}

function populateEpisodes(epData) {
  const $episodeList = $('#episodes-list');
  $episodeList.empty();

  for (let ep of epData) {
    let $epData = $(`<li>${ep.name} (season ${ep.season}, episode ${ep.number})
    </li>`);
    $episodeList.append($epData);
  }
  $('#episodes-area').show();
}

$('#shows-list').on('click', '.get-episodes', async function handleEpisodeClick(e) {
  let showId = $(e.target)
    .closest('.Show')
    .data('show-id');
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});

const imdb = require('imdb-api');
const clc = require('cli-color');
const SECRETS = require('./secrets');

const displayEpisode = ({season, episode, name, rating}, showTitle) => {
    const boldSeason = clc.blue.bold(season);
    const boldEp = clc.blue.bold(episode);
    const boldTitle = clc.magenta.bold(name);
    const boldShowTitle = clc.red.bold(showTitle);
    const itlRating = clc.blue.italic(`imdb rating: ${rating}`);
    console.log(`You're watching ${boldShowTitle} season ${boldSeason}, episode ${boldEp}, ${boldTitle} (${itlRating})`);
};

const verifyShow = work => {
    if (work.constructor.name === 'TVShow'){
        return work;
    }
    throw new Error(`${work.name} is not a TV Show, it's a ${work.constructor.name}`);
};
const getEpisodes = show => show.episodes();

const filterBlankEpisodes = eps => eps.filter(ep => !!ep.name);
const chooseRandomEpisode = eps => eps[eps.length * Math.random() | 0];
const errorHandler = err => {
    if (err.constructor.name === "ImdbError") {
        console.error(err.message);
    } else {
        console.error(err);
    }
};

const [ query ] = process.argv.slice(2);
const cli = new imdb.Client(SECRETS.imdb);

const go = async () => {
    try {
        const show = await cli.get({name: query || 'Seinfeld'})
        const verifiedShow = verifyShow(show);
        const { title: showTitle } = verifiedShow;
        const episodes = await getEpisodes(verifiedShow).then(filterBlankEpisodes);
        const episode = chooseRandomEpisode(episodes)
        displayEpisode(episode, showTitle);    
    } catch (error) {
        errorHandler(error);
    }
}

go();


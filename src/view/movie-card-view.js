import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import { getDurationString } from '../utils.js';
// {
//   "id": "d9ee14cd-c0ca-4eab-8088-2219a0dbdc55",
//   "comments": [
//   "915db71a-703a-492a-9242-dfd233a749f2"
//   ],
//   "film_info": {
//   "title": "A Little Pony Without The Carpet",
//   "alternative_title": "Laziness Who Sold Themselves",
//   "description": "Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.",
//   "total_rating": 5.3,
//   "poster": "images/posters/blue-blazes.jpg",
//   "age_rating": 0,
//   "director": "Tom Ford",
//   "writers": [
//   "Takeshi Kitano"
//   ],
//   "actors": [
//   "Morgan Freeman"
//   ],
//   "genre": [
//   "Comedy"
//   ],
//   "duration": 77,
//   "release": {
//   "date": "2019-05-11T00:00:00.000Z",
//   "release_country": "Finland"
//   }},
//   "user_details": {
//   "watchlist": false,
//   "already_watched": true,
//   "watching_date": "2022-11-26T16:12:32.554Z",
//   "favorite": false
//   }}

function createMovieCardTemplate(movie) {

  const { filmInfo, comments } = movie;
  const { poster, alternativeTitle, totalRating, release, duration, description, genre } = filmInfo;
  const { date } = release;

  return `
      <article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${alternativeTitle}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dayjs(date).year()}</span>
            <span class="film-card__duration">${getDurationString(duration)}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="./${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
}

export default class MovieCardView extends AbstractStatefulView {
  #movie;
  #handleClick;

  constructor(movie, { onClick }) {
    super();
    this.#handleClick = onClick;
    this.#movie = movie;
    this._restoreHandlers();
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  _restoreHandlers() {
    this.#addOnClickHandler();
  }

  #addOnClickHandler() {
    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleClick(this.#movie);
    });
  }
}

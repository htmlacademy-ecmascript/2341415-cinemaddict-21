import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import { getDurationString } from '../utils.js';

function createMovieCardTemplate(movie) {

  const { filmInfo, comments, userDetails } = movie;
  const { watchlist, alreadyWatched, favorite } = userDetails;
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
          <button class="film-card__controls-item ${watchlist ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item ${alreadyWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item ${favorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
}

export default class MovieCardView extends AbstractStatefulView {
  #handleClick;
  #handleWatchinglistButtonClick;
  #handleAlreadyWatchedListButtonClick;
  #handleFavoriteListButtonClick;

  constructor(movie, { onClick, onWatchinglistButtonClick, onAlreadyWatchedlistButtonClick, onFavoriteListButtonClick }) {
    super();
    this.#handleClick = onClick;
    this.#handleWatchinglistButtonClick = onWatchinglistButtonClick;
    this.#handleAlreadyWatchedListButtonClick = onAlreadyWatchedlistButtonClick;
    this.#handleFavoriteListButtonClick = onFavoriteListButtonClick;
    this._setState({ movie });
    this._restoreHandlers();
  }

  get template() {
    return createMovieCardTemplate(this._state.movie);
  }

  _restoreHandlers() {
    this.#addOnClickHandler();
    this.#addOnWatchinglistButtonClickHandler();
    this.#addonAlreadyWatchedListButtonClickHandler();
    this.#addOnFavoriteListButtonClickHandler();
  }

  #addOnClickHandler() {
    const imgElement = this.element.querySelector('.film-card__poster');

    imgElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleClick(this._state.movie);
    });
  }

  #addOnWatchinglistButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-card__controls-item--add-to-watchlist');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleWatchinglistButtonClick(this._state.movie.id);
    });
  }

  #addonAlreadyWatchedListButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-card__controls-item--mark-as-watched');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleAlreadyWatchedListButtonClick(this._state.movie.id);
    });
  }

  #addOnFavoriteListButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-card__controls-item--favorite');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleFavoriteListButtonClick(this._state.movie.id);
    });
  }

}

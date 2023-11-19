import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { PROFILE_RATING } from '../const.js';

function createLogoTemplate({ watchedMoviesCount }) {

  return `<section class="header__profile profile">
  <p class="profile__rating">${getRating(watchedMoviesCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
}

function getRating(watchedMoviesCount) {
  if (watchedMoviesCount < 1) {
    return '';
  }

  if (watchedMoviesCount <= 10) {
    return PROFILE_RATING.NOVICE;
  }

  if (watchedMoviesCount <= 20) {
    return PROFILE_RATING.FAN;
  }

  return PROFILE_RATING.MOVIE_BUFF;
}

export default class LogoView extends AbstractStatefulView {

  constructor({ watchedMoviesCount }) {
    super();
    this._setState({ watchedMoviesCount });
  }

  get template() {
    return createLogoTemplate(this._state);
  }

  _restoreHandlers() {
  }
}

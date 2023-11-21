import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { PROFILE_RATING } from '../const.js';

function createLogoTemplate({ historyMoviesCount }) {

  return `<section class="header__profile profile">
  <p class="profile__rating">${getRating(historyMoviesCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
}

function getRating(historyMoviesCount) {
  if (historyMoviesCount < 1) {
    return '';
  }

  if (historyMoviesCount <= 10) {
    return PROFILE_RATING.NOVICE;
  }

  if (historyMoviesCount <= 20) {
    return PROFILE_RATING.FAN;
  }

  return PROFILE_RATING.MOVIE_BUFF;
}

export default class LogoView extends AbstractStatefulView {

  constructor({ historyMoviesCount }) {
    super();
    this._setState({ historyMoviesCount });
  }

  get template() {
    return createLogoTemplate(this._state);
  }

  _restoreHandlers() {
  }
}

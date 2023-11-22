import AbstractView from '../framework/view/abstract-view.js';
import { FILTERTYPE } from '../const.js';

const messages = {
  [FILTERTYPE.ALL_MOVIES]: 'There are no movies in our database',
  [FILTERTYPE.FAVORITES]: 'There are no favorite movies now',
  [FILTERTYPE.HISTORY]: 'There are no watched movies now',
  [FILTERTYPE.WATCHLIST]: 'There are no movies to watch now',

};

function createNoMoviesTemplate(selectedFilter) {
  return `<section class="films-list">
    <h2 class="films-list__title">${messages[selectedFilter]}</h2>
  </section>`;
}

export default class NoMoviesView extends AbstractView {
  #selectedFilter = null;

  constructor(selectedFilter) {
    super();
    this.#selectedFilter = selectedFilter;
  }

  get template() {
    return createNoMoviesTemplate(this.#selectedFilter);
  }
}

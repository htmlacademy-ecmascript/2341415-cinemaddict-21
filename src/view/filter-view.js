import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { FILTERTYPE } from '../const.js';

function createFilterTemplate({ counts, selectedFilter }) {
  const { watchlistCount, favoriteCount, historyCount } = counts;

  return `<nav class="main-navigation">
    <a href="#all" data-filtertype="${FILTERTYPE.ALL_MOVIES}" class="main-navigation__item ${selectedFilter === 'All movies' ? 'main-navigation__item--active' : ''}">All movies</a>
    <a href="#watchlist" data-filtertype="${FILTERTYPE.WATCHLIST}" class="main-navigation__item ${selectedFilter === 'Watchlist' ? 'main-navigation__item--active' : ''}">Watchlist <span data-filtertype="${FILTERTYPE.WATCHLIST}" class="main-navigation__item-count">${watchlistCount}</span></a>
    <a href="#history" data-filtertype="${FILTERTYPE.HISTORY}" class="main-navigation__item ${selectedFilter === 'History' ? 'main-navigation__item--active' : ''}">History <span data-filtertype="${FILTERTYPE.HISTORY}" class="main-navigation__item-count">${historyCount}</span></a>
    <a href="#favorites" data-filtertype="${FILTERTYPE.FAVORITES}" class="main-navigation__item ${selectedFilter === 'Favorites' ? 'main-navigation__item--active' : ''}">Favorites <span data-filtertype="${FILTERTYPE.FAVORITES}" class="main-navigation__item-count">${favoriteCount}</span></a>
  </nav>`;
}

export default class FilterView extends AbstractStatefulView {

  #handleFilterClick = null;

  /**
   *
   * @param {Number} params.counts.watchlistCount
   * @param {Number} params.counts.favoriteCount
   * @param {Number} params.counts.historyCount
   * @param {String} params.selectrdFilter
   */
  constructor(params, { onFilterClick }) {
    super();
    this._setState(params);
    this.#handleFilterClick = onFilterClick;
    this._restoreHandlers();
  }

  get template() {
    return createFilterTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', (evt) => {
      if (evt.target.dataset.filtertype) {
        this.#handleFilterClick(evt.target.dataset.filtertype);
      }
    });
  }

}

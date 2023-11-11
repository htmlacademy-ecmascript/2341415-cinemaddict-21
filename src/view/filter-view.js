import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilterTemplate({ counts, selectedFilter }) {
  const { watchlistCount, favoriteCount, historyCount } = counts;

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${selectedFilter === 'All movies' ? 'main-navigation__item--active' : ''}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${selectedFilter === 'Watchlist' ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
    <a href="#history" class="main-navigation__item ${selectedFilter === 'History' ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${historyCount}</span></a>
    <a href="#favorites" class="main-navigation__item ${selectedFilter === 'Favorites' ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
  </nav>`;
}

export default class FilterView extends AbstractStatefulView {

  #onFilterClick = null;

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
    this.#onFilterClick = onFilterClick;
    this._restoreHandlers();
  }

  get template() {
    return createFilterTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', (evt) => {
      const filterType = evt.target.textContent === 'All movies' ? 'All movies' : evt.target.textContent.split(' ')[0];
      this.#onFilterClick(filterType);
    });
  }

}

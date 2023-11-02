import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilterTemplate({ watchlistCount, favoriteCount, historyCount }) {

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
  </nav>`;
}

export default class FilterView extends AbstractStatefulView {

  #onFilterClick = null;
  filtredMoviesCounter = null;
  #counts = null;

  constructor(counts, { onFilterClick }) {
    super();
    this.#counts = counts;
    this.#onFilterClick = onFilterClick;
    this._restoreHandlers();
  }

  get template() {
    return createFilterTemplate(this.#counts);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', (evt) => {
      const filterType = evt.target.textContent === 'All movies' ? 'All movies' : evt.target.textContent.split(' ')[0];
      this.#onFilterClick(filterType);
    });
  }

}

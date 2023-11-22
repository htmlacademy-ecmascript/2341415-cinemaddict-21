import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { SORTING_ORDER } from '../const.js';

function createSortTemplate({ selectedSortingOrder, isVisible }) {

  return `<ul class="sort${isVisible ? '' : ' hidden'}">
  <li><a data-sortingorder="${SORTING_ORDER.DEFAULT}" href="#" class="sort__button ${SORTING_ORDER.DEFAULT === selectedSortingOrder ? ' sort__button--active' : ''}">Sort by default</a></li>
  <li><a data-sortingorder="${SORTING_ORDER.DATE}" href="#" class="sort__button ${SORTING_ORDER.DATE === selectedSortingOrder ? ' sort__button--active' : ''}">Sort by date</a></li>
  <li><a data-sortingorder="${SORTING_ORDER.RATING}" href="#" class="sort__button ${SORTING_ORDER.RATING === selectedSortingOrder ? ' sort__button--active' : ''}">Sort by rating</a></li>
</ul>`;
}

export default class SortView extends AbstractStatefulView {

  #handleSortingClick = null;

  constructor({ selectedSortingOrder, isVisible }, listeners) {
    super();
    const { onSortingClick } = listeners;
    this.#handleSortingClick = onSortingClick;
    this._setState({ selectedSortingOrder, isVisible });
    this._restoreHandlers();
  }

  get template() {
    return createSortTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      const sortingOrder = evt.target.dataset.sortingorder;

      if (sortingOrder) {
        this.#handleSortingClick(sortingOrder);
      }
    });
  }
}

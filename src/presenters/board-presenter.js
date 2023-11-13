import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
import {RenderPosition} from '../framework/render.js';
import { EVENTS } from '../models/movies-model.js';
import { SORTING_ORDER } from '../const.js';

export default class BoardPresenter {
  #mainContainer = null;
  #headerElement = null;
  #moviesModel = null;
  #showMoreButtonView = null;
  #filterView = null;
  #sortView = null;

  constructor({mainContainer, headerContainer, moviesModel}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#moviesModel = moviesModel;
  }

  run() {
    this.#renderLogo();
    this.#createSortView();

    this.#moviesModel.addObserver(
      EVENTS.FILTRED_MOVIES_CHANGED,
      (params) => this.#renderFilters(params)
    );

    this.#moviesModel.addObserver(
      EVENTS.SELECTED_FILTER_CHANGED,
      (selectedFilter) => this.#filterView.updateElement({ selectedFilter })
    );


    this.#moviesModel.addObserver(
      EVENTS.SORTING_ORDER_CHANGED,
      (selectedSortingOrder) => this.#sortView.updateElement({ selectedSortingOrder })
    );

    this.#renderSort();
  }

  #renderFilters(params) {
    if(!this.#filterView) {
      this.#filterView = this.#createFilterView(params);
      this.#mainContainer.add(this.#filterView, RenderPosition.BEFOREBEGIN);
    }
    this.#filterView.updateElement(params);
  }

  #renderSort() {
    if(!this.#sortView) {
      this.#sortView = this.#createSortView();
      this.#mainContainer.add(this.#sortView, RenderPosition.BEFOREBEGIN);
    }
    this.#sortView.updateElement();
  }

  #createFilterView(params) {
    return new FilterView(
      params,
      {
        onFilterClick: (filterType) => {
          this.#moviesModel.setFilter(filterType);
        },
      },
    );
  }

  #renderLogo() {
    this.#headerElement.add(new LogoView());
  }

  #createSortView() {
    return new SortView(SORTING_ORDER.DEFAULT, { onSortingClick: (sortingOrder) => {
      this.#moviesModel.setSortingOrder(sortingOrder);
    } });
  }
}

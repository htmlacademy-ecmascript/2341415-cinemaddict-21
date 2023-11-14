import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
import {RenderPosition} from '../framework/render.js';
import { EVENTS } from '../models/movies-model.js';
import { SORTING_ORDER } from '../const.js';
import FilmCountView from '../view/film-count-view.js';

export default class BoardPresenter {
  #mainContainer = null;
  #headerElement = null;
  #moviesModel = null;
  #showMoreButtonView = null;
  #filterView = null;
  #sortView = null;
  #footerContainer = null;
  #filmCountView = null;

  constructor({mainContainer, headerContainer, moviesModel, footerContainer}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#moviesModel = moviesModel;
    this.#footerContainer = footerContainer;
  }

  run() {
    this.#renderLogo();
    this.#createSortView();
    // this.#renderFilmCount();
    this.#moviesModel.addObserver(
      EVENTS.MODEL_INITIALIZED,
      () => this.#renderFilmCount()
    );

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

  #renderFilmCount() {
    const filmCount = this.#moviesModel.moviesLength;
    this.#footerContainer.add(new FilmCountView(filmCount));
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

  // #createFilmCountView() {
  //   return new FilmCountView();
  // }

}

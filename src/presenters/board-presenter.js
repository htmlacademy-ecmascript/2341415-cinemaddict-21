import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
import { RenderPosition } from '../framework/render.js';
import { EVENTS } from '../models/movies-model.js';
import { SORTING_ORDER } from '../const.js';
import FilmCountView from '../view/film-count-view.js';

export default class BoardPresenter {
  #headerElement = null;
  #moviesModel = null;
  #filterView = null;
  #sortView = null;
  #logoView = null;
  #footerContainer = null;
  #mainContainer = null;

  constructor({headerContainer, moviesModel, footerContainer, mainContainer}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#moviesModel = moviesModel;
    this.#footerContainer = footerContainer;
  }

  run() {
    this.#renderLogo();
    this.#moviesModel.addObserver(
      EVENTS.MODEL_INITIALIZED,
      () => {
        this.#renderFilmCount();
        this.#renderSort();
      }
    );

    this.#moviesModel.addObserver(
      EVENTS.FILTRED_MOVIES_CHANGED,
      (params) => {
        const { counts } = params;
        this.#logoView.updateElement({ watchedMoviesCount: counts.watchlistCount });
        this.#renderFilters(params);
      }
    );

    this.#moviesModel.addObserver(
      EVENTS.SELECTED_FILTER_CHANGED,
      (selectedFilter) => {
        this.#filterView.updateElement({ selectedFilter });
        this.#sortView.updateElement({ isVisible: !this.#moviesModel.isFiltredMoviesEmpty });
      }
    );

    this.#moviesModel.addObserver(
      EVENTS.SORTING_ORDER_CHANGED,
      (selectedSortingOrder) => this.#sortView.updateElement({ selectedSortingOrder, isVisible: !this.#moviesModel.isFiltredMoviesEmpty })
    );
  }

  #renderFilters(params) {
    if(!this.#filterView) {
      this.#filterView = this.#createFilterView(params);
      this.#mainContainer.add(this.#filterView, RenderPosition.BEFOREBEGIN);
    }
    this.#filterView.updateElement(params);
  }

  #renderSort() {
    this.#sortView = this.#createSortView();
    this.#mainContainer.add(this.#sortView, RenderPosition.AFTERBEGIN);
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

  #renderLogo(watchedMoviesCount = 0) {
    this.#logoView = new LogoView({ watchedMoviesCount });
    this.#headerElement.add(this.#logoView);
  }

  #createSortView() {
    return new SortView(
      {
        selectedSortingOrder: SORTING_ORDER.DEFAULT,
        isVisible: !this.#moviesModel.isFiltredMoviesEmpty
      },
      {
        onSortingClick: (sortingOrder) => {
          this.#moviesModel.setSortingOrder(sortingOrder);
        }
      }
    );
  }
}

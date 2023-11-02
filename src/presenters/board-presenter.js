import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
import {RenderPosition} from '../framework/render.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { EVENTS } from '../models/movies-model.js';

export default class BoardPresenter {
  #mainContainer = null;
  #headerElement = null;
  #moviesModel = null;
  #showMoreButtonView = null;

  constructor({mainContainer, headerContainer, moviesModel}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#moviesModel = moviesModel;
  }

  run() {
    this.#renderLogo();
    this.#renderShowMoreButton();
    this.#renderSort();
    this.#moviesModel.addObserver(
      EVENTS.ALL_MOVIES_DISPLAYED,
      () => {
        this.#showMoreButtonView.hide();
      }
    );
    this.#moviesModel.addObserver(
      EVENTS.FILTRED_MOVIES_CHANGED,
      (filtredMoviesCount) => {
        this.#renderFilters(filtredMoviesCount);
      }
    );
  }

  #renderFilters(filtredMoviesCount) {
    this.#mainContainer.add(new FilterView(
      filtredMoviesCount,
      {
        onFilterClick: (filterType) => {
          this.#moviesModel.setFilter(filterType);
        },
      },
    ), RenderPosition.BEFOREBEGIN);
  }

  #renderLogo() {
    this.#headerElement.add(new LogoView());
  }

  #renderShowMoreButton() {
    const onClick = () => {
      this.#moviesModel.addDisplayedMovies();
    };
    const showMoreButtonView = new ShowMoreButtonView({ onClick });
    this.#showMoreButtonView = showMoreButtonView;
    this.#mainContainer.add(this.#showMoreButtonView, RenderPosition.AFTEREND);
  }

  #renderSort() {
    this.#mainContainer.add(new SortView(), RenderPosition.BEFOREBEGIN);
  }
}

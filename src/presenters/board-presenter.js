import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
// import PopupView from '../view/popup-view.js';
import {RenderPosition} from '../framework/render.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { EVENTS } from '../models/movies-model.js';

export default class BoardPresenter {
  #mainContainer = null;
  #headerElement = null;
  #popupContainer = null;
  #moviesModel = null;
  #showMoreButtonView = null;

  constructor({mainContainer, headerContainer, popupContainer, moviesModel}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#popupContainer = popupContainer;
    this.#moviesModel = moviesModel;
  }

  run() {
    this.#renderFilters();
    this.#renderLogo();
    this.#renderShowMoreButton();
    this.#renderSort();
    this.#moviesModel.addObserver(
      EVENTS.ALL_MOVIES_DISPLAYED,
      () => {
        this.#showMoreButtonView.hide();
      }
    );
    // this.#renderPopup();
  }

  // onMoviesChanged(movies) {
  // }

  #renderFilters() {
    this.#mainContainer.add(new FilterView(), RenderPosition.BEFOREBEGIN);
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

  // #renderPopup() {
  //   this.#popupContainer.add(new PopupView());
  // }

}

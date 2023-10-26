import FilterView from '../view/filter-view.js';
import LogoView from '../view/logo-view.js';
import SortView from '../view/sort-view.js';
// import PopupView from '../view/popup-view.js';
import {RenderPosition} from '../framework/render.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class BoardPresenter {
  #mainContainer = null;
  #headerElement = null;
  #popupContainer = null;

  constructor({mainContainer, headerContainer, popupContainer}) {
    this.#mainContainer = mainContainer;
    this.#headerElement = headerContainer;
    this.#popupContainer = popupContainer;
  }

  run() {
    this.#renderFilters();
    this.#renderLogo();
    this.#renderShowMoreButton();
    this.#renderSort();
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
    this.#mainContainer.add(new ShowMoreButtonView(), RenderPosition.AFTEREND);
  }

  #renderSort() {
    this.#mainContainer.add(new SortView(), RenderPosition.BEFOREBEGIN);
  }

  // #renderPopup() {
  //   this.#popupContainer.add(new PopupView());
  // }

}

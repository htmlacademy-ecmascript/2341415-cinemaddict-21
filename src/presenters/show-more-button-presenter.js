import {RenderPosition} from '../framework/render.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { EVENTS } from '../models/movies-model.js';

export default class ShowMoreButtonPresenter {
  #mainContainer = null;
  #moviesModel = null;
  #showMoreButtonView = null;

  constructor({mainContainer, moviesModel}) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
  }

  run() {
    this.#renderShowMoreButton();

    this.#moviesModel.addObserver(
      EVENTS.ALL_MOVIES_DISPLAYED,
      () => {
        this.#showMoreButtonView.hide();
      }
    );

    this.#moviesModel.addObserver(
      EVENTS.MOVIES_PART_DISPLAYED,
      () => {
        this.#showMoreButtonView.show();
      }
    );
  }

  #renderShowMoreButton() {
    const onClick = () => {
      this.#moviesModel.addDisplayedMovies();
    };
    const showMoreButtonView = new ShowMoreButtonView({ onClick });
    this.#showMoreButtonView = showMoreButtonView;
    this.#mainContainer.add(this.#showMoreButtonView, RenderPosition.AFTEREND);
  }
}

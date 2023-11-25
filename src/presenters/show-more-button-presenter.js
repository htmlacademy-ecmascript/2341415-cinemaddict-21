import {RenderPosition} from '../framework/render.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { EVENTS } from '../models/movies-model.js';

export default class ShowMoreButtonPresenter {
  #movieCardsContainer = null;
  #moviesModel = null;
  #showMoreButtonView = null;

  constructor({movieCardsContainer, moviesModel}) {
    this.#movieCardsContainer = movieCardsContainer;
    this.#moviesModel = moviesModel;
  }

  init() {
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

    this.#moviesModel.addObserver(
      EVENTS.DATA_LOADING_ERROR,
      () => {
        this.#showMoreButtonView.hide();
      }
    );
  }

  #renderShowMoreButton() {
    const onClick = () => {
      this.#moviesModel.addDisplayedMovies();
    };
    const showMoreButtonView = new ShowMoreButtonView({ onClick });
    this.#showMoreButtonView = showMoreButtonView;
    this.#movieCardsContainer.add(this.#showMoreButtonView, RenderPosition.AFTEREND);
  }
}

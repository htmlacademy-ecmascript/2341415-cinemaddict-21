import PopupView from '../view/popup-view.js';
import { hideOverflow, showOverflow } from '../utils.js';
import { EVENTS } from '../models/movies-model.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const body = document.querySelector('body');

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 0,
};

export default class PopupPresenter {
  #popupContainer = null;
  moviesModel = null;
  #popupView = null;

  uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ popupContainer, moviesModel }) {
    this.#popupContainer = popupContainer;
    this.moviesModel = moviesModel;
  }

  init() {
    this.moviesModel.addObserver(EVENTS.MOVIE_UPDATED, (updatedMovie) => {
      if (this.#popupView?.movieId === updatedMovie.id) {
        this.#popupView.updateElement({ movie: updatedMovie });
        this.uiBlocker.unblock();
      }
    });

    this.moviesModel.addObserver(EVENTS.MOVIE_COMMENT_ADDED, ({ movie, comments }) => {
      if (this.#popupView?.movieId === movie.id) {
        this.#updatePopup({ movie, comments });
      }
    });

    this.moviesModel.addObserver(EVENTS.MOVIE_COMMENT_DELETED, ({ movie, comments }) => {
      if (this.#popupView?.movieId === movie.id) {
        this.#updatePopup({ movie, comments });
      }
    });
  }

  renderPopup({ movie, comments }) {
    const onCancel = () => {
      this.#closePopup();
      showOverflow(body);
    };

    const onEsc = () => {
      this.#closePopup();
      showOverflow(body);
    };

    this.#popupContainer.clear();
    hideOverflow(body);

    const onWatchinglistButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToWatchList(movieId).catch((err) => {
        this.#handleError(err);
        this.#popupView.shakePopupFilters(() => this.#popupView.updateElement({}));
      });
    };

    const onAlreadyWatchedButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToAlreadyWatchedList(movieId).catch((err) => this.#handleError(err));
    };

    const onFavoriteButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToFavoriteList(movieId).catch((err) => this.#handleError(err));
    };

    const onCommentAddingClick = (movieId, comment) => {
      this.uiBlocker.block();
      this.moviesModel.addComment(movieId, comment).catch(() => {
        this.uiBlocker.unblock();
        this.#popupView.shakeAddingComment(() => this.#popupView.updateElement({}));
      });
    };

    const onCommentDeleteClick = (params) => {
      this.uiBlocker.block();
      this.moviesModel.deleteComment(params).catch(() => {
        this.uiBlocker.unblock();
        this.#popupView.shakeComments(() => this.#popupView.updateElement({}));
      });
    };

    this.#popupView = new PopupView({ movie, comments }, {
      onCancel,
      onEsc,
      onWatchinglistButtonClick,
      onAlreadyWatchedButtonClick,
      onFavoriteButtonClick,
      onCommentAddingClick,
      onCommentDeleteClick
    });

    this.#popupContainer.add(this.#popupView);
  }

  #closePopup() {
    this.#popupView = null;
    this.#popupContainer.clear();
  }

  #handleError() {
    this.uiBlocker.unblock();
    this.#popupView.shake(() => this.#popupView.updateElement({}));
  }

  #updatePopup(params) {
    this.#popupView.update(params);
    this.uiBlocker.unblock();
  }
}

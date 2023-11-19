import PopupView from '../view/popup-view.js';
import { hideOverflow, showOverflow } from '../utils.js';
import { EVENTS } from '../models/movies-model.js';

const body = document.querySelector('body');

export default class PopupPresenter {
  #popupContainer = null;
  moviesModel = null;
  #popupView = null;

  constructor({ popupContainer, moviesModel }) {
    this.#popupContainer = popupContainer;
    this.moviesModel = moviesModel;

    this.moviesModel.addObserver(EVENTS.MOVIE_UPDATED, (updatedMovie) => {
      if (this.#popupView?.movieId === updatedMovie.id) {
        this.#popupView.updateElement({ movie: updatedMovie });
      }
    });

    this.moviesModel.addObserver(EVENTS.MOVIE_COMMENT_ADDED, ({ movie, comments }) => {
      if (this.#popupView?.movieId === movie.id) {
        this.#popupView.update({ movie, comments });
      }
    });

    this.moviesModel.addObserver(EVENTS.MOVIE_COMMENT_DELETED, ({ movie, comments }) => {
      if (this.#popupView?.movieId === movie.id) {
        this.#popupView.update({ movie, comments });
      }
    });
  }

  renderPopup({ movie, comments, onClose }) {
    const onCancel = () => {
      this.#popupContainer.clear();
      showOverflow(body);
      onClose();
    };

    const onEsc = () => {
      this.#popupContainer.clear();
      showOverflow(body);
      onClose();
    };

    this.#popupContainer.clear();
    hideOverflow(body);

    const onWatchinglistButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToWatchList(movieId);
    };

    const onAlreadyWatchedButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToAlreadyWatchedList(movieId);
    };

    const onFavoriteButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToFavoriteList(movieId);
    };

    const onCommentAddingClick = (movieId, comment) => {
      this.moviesModel.addComment(movieId, comment);
    };

    const onCommentDeleteClick = (params) => {
      this.moviesModel.deleteComment(params);
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

}

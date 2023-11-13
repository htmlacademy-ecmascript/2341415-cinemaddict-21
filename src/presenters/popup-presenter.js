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

    this.#popupView = new PopupView({ movie, comments }, { onCancel, onEsc, onWatchinglistButtonClick, onAlreadyWatchedButtonClick, onFavoriteButtonClick });
    this.#popupContainer.add(this.#popupView);
  }

}

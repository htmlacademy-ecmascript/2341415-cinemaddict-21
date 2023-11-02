import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view.js';
import { hideOverflow, showOverflow } from '../utils.js';
import NoMoviesView from '../view/no-movies-view.js';
import { EVENTS } from '../models/movies-model';

const body = document.querySelector('body');
export default class MovieCardsPresenter {
  #cardsContainer = null;
  #popupContainer = null;
  moviesModel = null;

  constructor({ mainContainer, popupContainer, moviesModel }) {
    this.#popupContainer = popupContainer;
    this.#cardsContainer = mainContainer;
    this.moviesModel = moviesModel;
    this.moviesModel.addObserver(EVENTS.DISPLAYED_MOVIES_CHANGED, (displayedMovies) => this.onDisplayedMoviesChanged(displayedMovies));
  }

  onDisplayedMoviesAdded(movies) {
    if (!movies.length) {
      this.#cardsContainer.add(new NoMoviesView());
    }
    movies.forEach((movie) => this.#renderMovieCards(movie));
  }

  onDisplayedMoviesChanged(displayedMovies) {
    this.#cardsContainer.clear();
    this.onDisplayedMoviesAdded(displayedMovies);
  }

  #renderMovieCards(movie) {
    const onClick = async (theMovie) => {
      hideOverflow(body);
      const comments = await this.moviesModel.getComments(theMovie.id);
      this.#renderPopup({ movie: theMovie, comments });
    };
    const movieCardView = new MovieCardView(movie, { onClick });
    this.#cardsContainer.add(movieCardView);
  }

  #renderPopup({ movie, comments }) {
    const onCancel = () => {
      this.#popupContainer.clear();
      showOverflow(body);
    };
    const onEsc = () => {
      this.#popupContainer.clear();
      showOverflow(body);
    };
    this.#popupContainer.clear();
    this.#popupContainer.add(new PopupView({ movie, comments }, { onCancel, onEsc }));
  }

}

import MovieCardView from '../view/movie-card-view';
import NoMoviesView from '../view/no-movies-view.js';
import { EVENTS } from '../models/movies-model';

export default class MovieCardsPresenter {
  #cardsContainer = null;
  #popupPresenter = null;
  moviesModel = null;
  #movieViewMap = new Map();

  constructor({ mainContainer, popupPresenter, moviesModel }) {
    this.#popupPresenter = popupPresenter;
    this.#cardsContainer = mainContainer;
    this.moviesModel = moviesModel;

    this.moviesModel.addObserver(EVENTS.DISPLAYED_MOVIES_CHANGED, (displayedMovies) => this.onDisplayedMoviesChanged(displayedMovies));

    this.moviesModel.addObserver(EVENTS.MOVIE_UPDATED, (updatedMovie) => {
      const movieView = this.#movieViewMap.get(updatedMovie.id);
      movieView.updateElement({ movie: updatedMovie });
    });

    this.moviesModel.addObserver(
      EVENTS.SELECTED_FILTER_CHANGED,
      () => this.#cardsContainer.clear()
    );
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
      const comments = await this.moviesModel.getComments(theMovie.id);
      this.#cardsContainer.block();
      this.#popupPresenter.renderPopup({ movie: theMovie, comments, onClose: () => this.#cardsContainer.unblock() });
    };
    const onWatchinglistButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToWatchList(movieId);
    };
    const onAlreadyWatchedlistButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToAlreadyWatchedList(movieId);
    };
    const onFavoriteListButtonClick = (movieId) => {
      this.moviesModel.switcIncludingToFavoriteList(movieId);
    };
    const movieCardView = new MovieCardView(movie, { onClick, onWatchinglistButtonClick, onAlreadyWatchedlistButtonClick, onFavoriteListButtonClick});
    this.#movieViewMap.set(movie.id, movieCardView);
    this.#cardsContainer.add(movieCardView);
  }

}

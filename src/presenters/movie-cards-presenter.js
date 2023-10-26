import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view.js';

export default class MovieCardsPresenter {
  #cardsContainer = null;
  #popupContainer = null;
  moviesModel = null;

  constructor({ mainContainer, popupContainer, moviesModel }) {
    this.#popupContainer = popupContainer;
    this.#cardsContainer = mainContainer;
    this.moviesModel = moviesModel;
  }

  onMoviesChanged(movies) {
    movies.slice(0 ,5).forEach((movie) => this.#renderMovieCards(movie));
  }

  #renderMovieCards(movie) {
    const onClick = async (theMovie) => {
      const comments = await this.moviesModel.getComments(theMovie.id);
      this.#renderPopup({ movie: theMovie, comments });
    };
    const movieCardView = new MovieCardView(movie, { onClick });
    this.#cardsContainer.add(movieCardView);
  }

  #renderPopup({ movie, comments }) {
    this.#popupContainer.clear();
    this.#popupContainer.add(new PopupView({ movie, comments }, { onCancel: () => this.#popupContainer.clear() }));
  }

}

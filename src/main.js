import ContainerView from './framework/view/container-view.js';
import MoviesModel, { EVENTS } from './models/movies-model.js';
import BoardPresenter from './presenters/board-presenter.js';
import PopupPresenter from './presenters/popup-presenter.js';
import MovieCardsPresenter from './presenters/movie-cards-presenter.js';
import { DISPLAYED_MOVIES_COUNT } from './const.js';
import ShowMoreButtonPresenter from './presenters/show-more-button-presenter.js';

const mainElement = document.querySelector('.main');
const filmListContainer = document.querySelector('.films-list__container');
const headerElement = document.querySelector('.header');
const popupElement = document.querySelector('.film-details');
const movieCardsContainer = new ContainerView(filmListContainer);
const mainContainer = new ContainerView(mainElement);
const footerElement = document.querySelector('.footer');

const moviesModel = new MoviesModel({ displayedMoviesCount: DISPLAYED_MOVIES_COUNT });

const boardPresenter = new BoardPresenter({
  filmListContainer,
  mainContainer,
  moviesModel,
  headerContainer: new ContainerView(headerElement),
  footerContainer: new ContainerView(footerElement)
});

const showMoreButtonPresenter = new ShowMoreButtonPresenter({
  movieCardsContainer,
  moviesModel
});

const popupPresenter = new PopupPresenter({
  popupContainer: new ContainerView(popupElement),
  moviesModel
});

const movieCardsPresenter = new MovieCardsPresenter({
  movieCardsContainer,
  popupPresenter,
  moviesModel
});

boardPresenter.run();
showMoreButtonPresenter.run();
moviesModel
  .addObserver(EVENTS.DISPLAYED_MOVIES_ADDED, (movies) => movieCardsPresenter.onDisplayedMoviesAdded(movies))
  .init();


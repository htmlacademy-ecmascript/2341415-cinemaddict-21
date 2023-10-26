import ContainerView from './framework/view/container-view.js';
import MoviesModel, { EVENTS } from './models/movies-model.js';
import BoardPresenter from './presenters/board-presenter.js';
import MovieCardsPresenter from './presenters/movie-cards-presenter.js';

const mainElement = document.querySelector('.films-list__container');
const headerElement = document.querySelector('.header');
const popupElement = document.querySelector('.film-details');
const mainContainer = new ContainerView(mainElement);

const boardPresenter = new BoardPresenter({
  // container: mainElement,
  // pointsModel,
  mainContainer,
  headerContainer: new ContainerView(headerElement),
  popupContainer: new ContainerView(popupElement)
});

const moviesModel = new MoviesModel();

const movieCardsPresenter = new MovieCardsPresenter({
  mainContainer,
  popupContainer: new ContainerView(popupElement),
  moviesModel
});

moviesModel
  .addObserver(EVENTS.MOVIES_CHANGED, (movies) => movieCardsPresenter.onMoviesChanged(movies))
  .init();

boardPresenter.run();

import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilmCountTemplate(moviesCount) {

  return `
  <section class="footer__statistics">
    <p>${moviesCount} movies inside</p>
  </section>`;
}

export default class FilmCountView extends AbstractStatefulView {

  #filmCount = null;

  constructor(filmCount) {
    super();
    this.#filmCount = filmCount;
  }

  get template() {
    return createFilmCountTemplate(this.#filmCount);
  }
}

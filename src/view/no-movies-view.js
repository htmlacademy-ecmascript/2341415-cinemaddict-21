import AbstractView from '../framework/view/abstract-view.js';

function createNoMoviesTemplate() {
  return `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`;
}

export default class NoMoviesView extends AbstractView {
  get template() {
    return createNoMoviesTemplate();
  }
}

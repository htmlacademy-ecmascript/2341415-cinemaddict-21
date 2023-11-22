import AbstractView from '../framework/view/abstract-view.js';

function createPreLoadMoviesMessageTemplate() {
  return `<section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>`;
}

export default class PreLoadMoviesMessageView extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createPreLoadMoviesMessageTemplate();
  }
}

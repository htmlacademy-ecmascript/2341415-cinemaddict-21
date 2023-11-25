import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPreLoadMoviesMessageTemplate({ message }) {
  return `<section class="films-list">
    <h2 class="films-list__title">${message}</h2>
  </section>`;
}

export default class PreLoadMoviesMessageView extends AbstractStatefulView {

  constructor(message) {
    super();
    this._setState({ message });
  }

  _restoreHandlers() {
  }

  get template() {
    return createPreLoadMoviesMessageTemplate(this._state);
  }
}

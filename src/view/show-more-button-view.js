import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createShowMoreButtonTemplate() {

  return '<button class="films-list__show-more">Show more</button>';
}

export default class ShowMoreButtonView extends AbstractStatefulView {
  get template() {
    return createShowMoreButtonTemplate();
  }
}

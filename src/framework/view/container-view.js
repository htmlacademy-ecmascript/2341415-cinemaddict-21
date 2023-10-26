import { RenderPosition, render } from '../render.js';

export default class ContainerView {
  #element = null;

  constructor(element) {
    this.#element = element;
  }

  add(view, place = RenderPosition.BEFOREEND) {
    render(view, this.#element, place);
  }

  clear() {
    this.#element.innerHTML = '';
  }
}

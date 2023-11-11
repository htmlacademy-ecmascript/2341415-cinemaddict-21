import { RenderPosition, render } from '../render.js';
import ContainerBlocker from '../ui-blocker/container-blocker.js';

export default class ContainerView {
  #element = null;
  #containerBlocker = new ContainerBlocker();

  constructor(element) {
    this.#element = element;
  }

  add(view, place = RenderPosition.BEFOREEND) {
    render(view, this.#element, place);
  }

  clear() {
    this.#element.innerHTML = '';
  }

  block() {
    this.#containerBlocker.block(this.#element);
  }

  unblock() {
    this.#containerBlocker.unblock();
  }
}

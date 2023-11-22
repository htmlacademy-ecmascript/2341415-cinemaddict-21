import './ui-blocker.css';

export default class ContainerBlocker {

  #element;

  block(container) {
    this.#element = document.createElement('div');
    this.#element.classList.add('container-blocker');
    container.append(this.#element);
    this.#element.classList.add('container-blocker--on');
  }

  unblock() {
    this.#element.remove();
  }
}

import './ui-blocker.css';

export default class ContainerBlocker {

  #element;

  block(container) {
    console.log(11111111111111111)
    this.#element = document.createElement('div');
    this.#element.classList.add('container-blocker');
    container.append(this.#element);
    this.#element.classList.add('container-blocker--on');
  }

  unblock() {
    this.#element.remove();
  }
}

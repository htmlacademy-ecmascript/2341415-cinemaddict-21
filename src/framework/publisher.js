/**
 * Класс, реализующий паттерн Наблюдатель.
 */
export default class Publisher {
  /** @type {Map<eventName, Set<observerCallback>>} Множество функций типа observerCallback */
  #observers = new Map();

  /**
   * Метод, позволяющий подписаться на событие
   * @param {eventName} eventName Имя события
   * @param {observerCallback} observer Функция, которая будет вызвана при наступлении события
   */
  addObserver(eventName, observer) {
    const observers = this._getEventObservers(eventName);
    observers.add(observer);

    return this;
  }

  /**
   * Метод, позволяющий отписаться от события
   * @param {String} eventName Имя события
   * @param {observerCallback} observer Функция, которую больше не нужно вызывать при наступлении события
   */
  removeObserver(eventName, observer) {
    const observers = this._getEventObservers(eventName);
    observers.delete(observer);
  }

  _getEventObservers(eventName) {
    if (!this.#observers.has(eventName)) {
      this.#observers.set(eventName, new Set());
    }

    return this.#observers.get(eventName);
  }

  /**
   * Метод для оповещения подписчиков о наступлении события
   * @param {String} eventName Имя события
   * @param {*} payload Дополнительная информация
   */
  _notify(eventName, payload) {
    const observers = this._getEventObservers(eventName);
    observers.forEach((observer) => observer(payload));
  }
}

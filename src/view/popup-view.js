import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDurationString } from '../utils.js';
import he from 'he';
import { differenceInCalendarYears, differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks } from 'date-fns';

const emojiIconPath = {
  smile: './images/emoji/smile.png',
  sleeping: './images/emoji/sleeping.png',
  puke: './images/emoji/puke.png',
  angry: './images/emoji/angry.png'
};

function getEmojiImgTeg(emoji) {
  return `<img src="${emojiIconPath[emoji]}" width="55" height="55" alt="emoji">`;
}

function getReliaseDate(isoStr) {
  const date = new Date(isoStr);
  const month = date.toLocaleString('default', { month: 'long' });
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

function getQuantityPostfix(count) {
  const SINGLE_VALUE = 1;

  return count > SINGLE_VALUE ? 's' : '';
}

function getDateDifferenceMessage(difference, unit) {
  return `${difference} ${unit}${getQuantityPostfix(difference)} ago.`;
}


function getCommentDateMessage(isoStr) {
  const now = new Date();
  const commentDate = new Date(isoStr);
  const differenceInYears = differenceInCalendarYears(now, commentDate);

  if (differenceInYears > 0) {
    return getDateDifferenceMessage(differenceInYears, 'year');
  }

  const diffInMonths = differenceInMonths(now, commentDate);

  if (diffInMonths > 0) {
    return getDateDifferenceMessage(diffInMonths, 'month');
  }

  const diffInWeeks = differenceInWeeks(now, commentDate);

  if (diffInWeeks > 0) {
    return getDateDifferenceMessage(diffInWeeks, 'week');
  }

  const diffInDays = differenceInDays(now, commentDate);

  if (diffInDays > 0) {
    return getDateDifferenceMessage(diffInDays, 'day');
  }

  const diffInHours = differenceInHours(now, commentDate);

  if (diffInHours > 0) {
    return getDateDifferenceMessage(diffInHours, 'hour');
  }

  const diffInMinutes = differenceInMinutes(now, commentDate);

  if (diffInMinutes > 0) {
    return getDateDifferenceMessage(diffInMinutes, 'minute');
  }

  return 'now';

}

function createCommentTemplate({emotion, comment, author, date, id}) {

  return `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${getCommentDateMessage(date)}</span>
              <button data-commentId=${id} class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`;
}

function createPopupTemplate({ movie, comments, selectedEmoji, newCommentText }) {
  const { filmInfo, userDetails } = movie;
  const { poster, title, totalRating, alternativeTitle, release, duration, description, genre, ageRating, director, writers, actors } = filmInfo;
  const { date, releaseCountry } = release;
  const { watchlist, alreadyWatched, favorite } = userDetails;

  return `<div class="film-details__inner">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${poster}" alt="">

        <p class="film-details__age">${ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${alternativeTitle}</h3>
            <p class="film-details__title-original">Original: ${title}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${getReliaseDate(date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Duration</td>
            <td class="film-details__cell">${getDurationString(duration)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
            <td class="film-details__cell">
            <span class="film-details__genre">${genre.join(', ')}</span>
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button ${watchlist ? 'film-details__control-button--active ' : ''}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button ${alreadyWatched ? 'film-details__control-button--active ' : ''}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button ${favorite ? 'film-details__control-button--active ' : ''}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>

  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${comments.map(createCommentTemplate).join('')}
      </ul>

      <form class="film-details__new-comment" action="" method="get">
        <div class="film-details__add-emoji-label">
        ${selectedEmoji ? getEmojiImgTeg(selectedEmoji) : ''}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText ?? ''}</textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${selectedEmoji === 'smile' ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${selectedEmoji === 'sleeping' ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${selectedEmoji === 'puke' ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${selectedEmoji === 'angry' ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </form>
    </section>
  </div>
</div>`;
}

export default class PopupView extends AbstractStatefulView {
  #handlePopupCancel = null;
  #handlePopupEsc = null;
  #handleWatchinglistButtonClick = null;
  #handleAlreadyWatchedButtonClick = null;
  #handleFavoriteButtonClick = null;
  #handleCommentAddingClick = null;
  #handleCommentDeleteClick = null;

  #removeKeyListteners() {
    document.removeEventListener('keydown', this.#escHandler);
    document.removeEventListener('keydown', this.#ctrlKeydownHandler);
    document.removeEventListener('keyup', this.#ctrlKeyupHandler);
    document.removeEventListener('keydown', this.#enterKeydownHandler);
  }

  #enterKeydownHandler = (evt) => {
    if (evt.code === 'Enter' && this._state.isAdditionalKeyPressed) {
      this.#addComment();
    }
  };

  #ctrlKeydownHandler = (evt) => {
    if (evt.ctrlKey || evt.metaKey) {
      this._setState({ isAdditionalKeyPressed: true });
    }
  };

  #ctrlKeyupHandler = (evt) => {
    if (evt.ctrlKey || evt.metaKey) {
      this._setState({ isAdditionalKeyPressed: false });
    }
  };

  #escHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.#removeKeyListteners();
      this.#handlePopupEsc();
    }
  };

  constructor({ movie, comments }, { onCancel, onEsc, onWatchinglistButtonClick, onAlreadyWatchedButtonClick, onFavoriteButtonClick, onCommentAddingClick, onCommentDeleteClick }) {
    super();
    this.#handlePopupCancel = onCancel;
    this.#handlePopupEsc = onEsc;
    this.#handleWatchinglistButtonClick = onWatchinglistButtonClick;
    this.#handleAlreadyWatchedButtonClick = onAlreadyWatchedButtonClick;
    this.#handleFavoriteButtonClick = onFavoriteButtonClick;
    this.#handleCommentAddingClick = onCommentAddingClick;
    this.#handleCommentDeleteClick = onCommentDeleteClick;
    this._setState({ movie, comments });
    this._restoreHandlers();
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  get movieId() {
    return this._state.movie.id;
  }

  update({ movie, comments }) {
    this.#resetCommentText();
    this.updateElement({ movie, comments, selectedEmoji: null });
  }

  _restoreHandlers() {
    this.#addOnCancelHandler();
    this.#addOnEscHandler();
    this.#addOnWatchinglistButtonClickHandler();
    this.#addonAlreadyWatchedListButtonClickHandler();
    this.#addOnFavoriteListButtonClickHandler();
    this.#handleEmojiClick();
    this.#handleCtrlKeydown();
    this.#handleCtrlKeyup();
    this.#handleEnterKeydown();
    this.#addOnCommentDeleteHandler();
  }

  shakeComments(callback) {
    const commentContainer = document.querySelector('.film-details__bottom-container');
    this.shakeElement(commentContainer, callback);
  }

  shakeAddingComment(callback) {
    const addingCommentContainer = document.querySelector('.film-details__new-comment');
    this.shakeElement(addingCommentContainer, callback);
  }

  shakePopupFilters(callback) {
    const popupFiltersContainer = document.querySelector('.film-details__controls');
    this.shakeElement(popupFiltersContainer, callback);
  }

  #addOnCancelHandler() {
    const closeButton = this.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#removeKeyListteners();
      this.#handlePopupCancel();
    });
  }

  #addOnEscHandler() {
    document.addEventListener('keydown', this.#escHandler);
  }

  #handleCtrlKeydown() {
    document.addEventListener('keydown', this.#ctrlKeydownHandler);
  }

  #handleCtrlKeyup() {
    document.addEventListener('keyup', this.#ctrlKeyupHandler);
  }

  #addComment() {
    const comment = this.#getCommentText();
    this._setState({ newCommentText: comment });
    const emotion = this._state.selectedEmoji;

    if (comment && emotion) {
      this.#handleCommentAddingClick(this._state.movie.id, { comment: he.encode(comment), emotion: he.encode(emotion) });
    }
  }

  #addOnCommentDeleteHandler() {
    const commentListElement = this.element.querySelector('.film-details__comments-list');

    commentListElement.addEventListener('click', (evt) => {
      if(evt.target.tagName === 'BUTTON') {
        evt.target.textContent = 'Deleting...';
        this.#handleCommentDeleteClick({ commentId: evt.target.dataset.commentid, movieId: this._state.movie.id});
      }
    });
  }

  #getCommentText() {
    const commentInput = this.element.querySelector('.film-details__comment-input');
    return commentInput.value;
  }

  #resetCommentText() {
    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.value = '';
    this._setState({ newCommentText: '' });
  }

  #handleEnterKeydown() {
    document.addEventListener('keydown', this.#enterKeydownHandler);
  }

  #addOnWatchinglistButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-details__control-button--watchlist');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleWatchinglistButtonClick(this._state.movie.id);
    });
  }

  #addonAlreadyWatchedListButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-details__control-button--watched');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleAlreadyWatchedButtonClick(this._state.movie.id);
    });
  }

  #addOnFavoriteListButtonClickHandler() {
    const buttonElement = this.element.querySelector('.film-details__control-button--favorite');

    buttonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleFavoriteButtonClick(this._state.movie.id);
    });
  }

  #handleEmojiClick() {
    const emojiElement = this.element.querySelector('.film-details__emoji-list');

    emojiElement.addEventListener('change', (evt) => {
      const selectedEmoji = evt.target.value;
      this.updateElement({ selectedEmoji, newCommentText: this.#getCommentText() });
    });
  }


}

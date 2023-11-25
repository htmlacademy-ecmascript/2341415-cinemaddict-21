const DURATION = {
  hoursInDay: 24,
  minInHour: 60,
};

const DISPLAYED_MOVIES_COUNT = 5;

const FILTERTYPE = {
  ALL_MOVIES: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const SORTING_ORDER = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const RESPONCE_STATUS = {
  SUCCESSFULY_DELETED: 204
};

const PROFILE_RATING = {
  NOVICE: 'novice',
  FAN: 'fan',
  MOVIE_BUFF: 'movie buff'
};


const RATING_MIN_WATCHED_MOVIES = {
  NOVICE: 1,
  FAN: 10,
  BUFF: 20,
};

const MAX_COMMENT_LENGTH = 139;

export {
  DURATION,
  DISPLAYED_MOVIES_COUNT,
  FILTERTYPE,
  SORTING_ORDER,
  RESPONCE_STATUS,
  PROFILE_RATING,
  RATING_MIN_WATCHED_MOVIES,
  MAX_COMMENT_LENGTH
};

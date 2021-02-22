import SongModel from '../models/SongModel';
import {concatWithoutSongDuplicates} from '../utils/songUtils';
import * as stringUtils from '../utils/stringUtils';
import {generateId} from '../utils/idUtils';
import deezerApi from '../api/DeezerApi';
import EventSystem from '../misc/EventSystem';

class SearchHelper {
  _SEARCH_RESULT_MAX_LENGTH = 90;

  constructor(props) {
    this._isSearching = false;
    this._searchResult = null;
    this._searchId = generateId();
    this._searchQuery = null;
    this._onSearchStart = new EventSystem();
    this._onSearchEnd = new EventSystem();
  }

  get isSearching() {
    return this._isSearching;
  }

  get searchResult() {
    return this._searchResult;
  }

  get searchId() {
    return this._searchId;
  }

  get searchQuery() {
    return this._searchQuery;
  }

  subscribeToSearchStart = (callback) => {
    this._onSearchStart.addListener(callback);
  };

  unsubscribeFromSearchStart = (callback) => {
    this._onSearchStart.removeListener(callback);
  };

  subscribeToSearchEnd = (callback) => {
    this._onSearchEnd.addListener(callback);
  };
  unsubscribeFromSearchEnd = (callback) => {
    this._onSearchEnd.removeListener(callback);
  };

  search = async (query) => {
    let formattedQuery = stringUtils.removeExtraSpaces(query);
    if (formattedQuery.length === 0) {
      return;
    }

    let currentSearchRequestId = generateId();
    this._searchId = currentSearchRequestId;
    this._searchQuery = formattedQuery;
    this._isSearching = true;

    this._onSearchStart.trigger(this._searchId, this._searchQuery);
    let json = await deezerApi.searchTrack(this._searchQuery);
    if (this._searchId !== currentSearchRequestId) {
      return;
    }

    this._searchResult = json.map((s) => new SongModel.fromDeezer(s));

    this._isSearching = false;
    this._onSearchEnd.trigger(
      this._searchId,
      this._searchQuery,
      this._searchResult,
    );
  };

  loadNextResult = async () => {
    if (
      this._searchResult.length === 0 ||
      this._searchResult.length === this._SEARCH_RESULT_MAX_LENGTH
    ) {
      return;
    }

    let json = await deezerApi.searchTrack(
      this._searchQuery,
      this._searchResult.length,
    );
    let trackModels = json.map((s) => new SongModel.fromDeezer(s));

    this._searchResult = concatWithoutSongDuplicates(
      this._searchResult,
      trackModels,
    );

    if (this._searchResult.length > this._SEARCH_RESULT_MAX_LENGTH) {
      this._searchResult = this._searchResult.slice(
        0,
        this._SEARCH_RESULT_MAX_LENGTH,
      );
    }
  };
}
export default new SearchHelper();

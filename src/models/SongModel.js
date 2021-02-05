import { generateId } from "../utils/idUtils";
import AlbumShortInfo from "./AlbumShortInfo";
import ARtistShortInfo from "./ArtistShortInfo";

class SongModel {
  static fromServerJson(json) {
    return new SongModel(json.uuid, json.albumUuid, json.title, json.artist);
  }

  static fromDeezer(obj) {
    let album = new AlbumShortInfo(
      obj.album.id,
      obj.album.title,
      obj.album.cover,
      obj.album.cover_small,
      obj.album.cover_medium,
      obj.album.cover_big,
      obj.album.cover_xl
    );
    let artist = new ARtistShortInfo(
      obj.artist.id,
      obj.artist.name,
      obj.artist.type
    );

    return new SongModel(
      obj.id,
      obj.title,
      obj.title_short,
      obj.title_version,
      obj.explicit_lyrics,
      obj.rank,
      obj.duration,
      album,
      artist
    );
  }

  static fromAnotherInstance(songModel) {
    return new SongModel(
      songModel.id,
      songModel.title,
      songModel.titleShort,
      songModel.titleVersion,
      songModel.explicitLyrics,
      songModel.rank,
      songModel.duration,
      songModel.album,
      songModel.artist
    );
  }

  constructor(
    id,
    title,
    titleShort,
    titleVersion,
    explicitLyrics,
    rank,
    duration,
    album,
    artist
  ) {
    this._id = id;
    this._title = title;
    this._titleShort = titleShort;
    this._titleVersion = titleVersion;
    this._explicitLyrics = explicitLyrics;
    this._rank = rank;
    this._duration = duration;
    this._album = album;
    this._artist = artist;
    this._instanceId = generateId();
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get titleShort() {
    return this._titleShort;
  }

  get titleVersion() {
    return this._titleVersion;
  }

  get explicitLyrics() {
    return this._explicitLyrics;
  }

  get rank() {
    return this._rank;
  }

  get duration() {
    return this._duration;
  }

  get album() {
    return this._album;
  }

  get artist() {
    return this._artist;
  }

  get instanceId() {
    return this._instanceId;
  }
}

export default SongModel;

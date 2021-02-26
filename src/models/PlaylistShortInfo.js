import Moment from 'moment';

class PlaylistShortInfo {
  static fromDeezer(data) {
    return new PlaylistShortInfo(
      data.id,
      data.title,
      Moment(data.creation_date).format('x') / 1000,
      data.creator.id,
      data.picture_big,
      data.picture_xl,
    );
  }

  constructor(id, title, creationTime, creatorId, coverBig, coverXl) {
    this.id = id;
    this.title = title;
    this.creationTime = creationTime;
    this.creatorId = creatorId;
    this.coverBig = coverBig;
    this.coverXl = coverXl;
  }
}

export default PlaylistShortInfo;

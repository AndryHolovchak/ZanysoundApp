class PlaylistShortInfo {
  static fromDeezer(data) {
    return new PlaylistShortInfo(
      data.id,
      data.title,
      data.time_add,
      data.creator.id,
      data.picture_big
    );
  }

  constructor(id, title, creationTime, creatorId, coverBig) {
    this.id = id;
    this.title = title;
    this.creationTime = creationTime;
    this.creatorId = creatorId;
    this.coverBig = coverBig;
  }
}

export default PlaylistShortInfo;

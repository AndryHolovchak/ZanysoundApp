class FreeSpaceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FreeSpaceError';
  }
}

export default FreeSpaceError;

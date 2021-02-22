import {navigate} from '../misc/RootNavigation';

const navigateToSearchRoute = (query) => {
  navigate('search', {q: query});
};

const navigateToPlaylistRoute = (id, navigation) => {
  navigation.push('playlist', {id});
};

export {navigateToSearchRoute, navigateToPlaylistRoute};

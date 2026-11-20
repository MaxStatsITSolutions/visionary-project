// Mirrors `Screen` from the Redux navigation slice on `chore/add-redux-toolkit`.
// Once that branch is in main, import the type from the slice and delete this file.
export type Screen =
  | 'home'
  | 'explore'
  | 'how-it-works'
  | 'studio'
  | 'projects'
  | 'project-details'
  | 'auth'
  | 'profile'
  | 'privacy';

export type NavigableScreen = Exclude<Screen, 'project-details'>;

export type Navigate = (screen: NavigableScreen) => void;

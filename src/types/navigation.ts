import type { Screen } from '../features/navigation/navigationSlice';

export type { Screen };

/** Screens reachable via `navigateTo` (project details uses `openProject`). */
export type NavigableScreen = Exclude<Screen, 'project-details'>;

export type Navigate = (screen: NavigableScreen) => void;

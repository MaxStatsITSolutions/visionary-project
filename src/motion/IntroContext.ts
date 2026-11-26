import { createContext, useContext } from 'react';

/** True once the preloader curtain has lifted; hero animations key off it. */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);

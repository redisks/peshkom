import { createContext, Dispatch, SetStateAction } from 'react';
import { IPlace } from '@/lib/types';

interface IPointsContext {
  points: IPlace[],
  setPoints: Dispatch<SetStateAction<IPlace[]>>,
}

export const PointsContext = createContext<IPointsContext>({
  points: [],
  setPoints: () => {},
});
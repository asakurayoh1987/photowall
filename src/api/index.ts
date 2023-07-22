import { ApiCode } from '@/api/constant';
import { images } from './mock';

export const fetch = (px: number = 0, ps: number = 30) => {
  const start = px * ps;
  const end = start + ps;

  const data = images.slice(start, end);
  return Promise.resolve({
    code: data.length > 0 ? ApiCode.SUCCESS : ApiCode.ERROR,
    data,
  });
};

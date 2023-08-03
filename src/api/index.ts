import { ApiCode } from '@/api/constant';
import { images } from './mock';
import { layout } from '@/lib/layout';

export const fetch = (px: number = 0, ps: number = 30) => {
  const start = px * ps;
  const end = start + ps;

  let slice = images.slice(start, end);
  let data = null;
  if (slice.length > 0) {
    const { route } = layout(slice, document.documentElement.clientWidth) || {};
    if (route) {
      data = route.reduce((pre, cur) => {
        if (cur.content) {
          return pre.concat(cur.content);
        }
        return pre;
      }, [] as Image[]);
    }
  }
  return Promise.resolve({
    code: slice.length > 0 ? ApiCode.SUCCESS : ApiCode.ERROR,
    data,
  });
};

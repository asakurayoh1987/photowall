import { images } from '@/api/mock';
import { layout } from '@/lib/layout';

const { route } = layout(images.slice(0, 100), 823) || {};

if (route) {
  console.log(JSON.stringify(route));
}

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetch } from '@/api';
import { ApiCode } from '@/api/constant';

export const useImageResStore = defineStore('image-res', () => {
  const imageRes = ref<Image[]>([]);

  const qryImageRes = async (px: number, ps: number = 200) => {
    const { code, data } = await fetch(px, ps);
    if (code === ApiCode.SUCCESS && data) {
      imageRes.value = px === 0 ? data : imageRes.value.concat(data);
    }
  };

  const init = async () => {
    await qryImageRes(0);
  };

  return {
    imageRes,
    init,
    qryImageRes,
  };
});

import { useImageResStore } from '@/store';
import { storeToRefs } from 'pinia';
import { defineComponent, onBeforeMount } from 'vue';

import Photo from '@/components/Photo';

export default defineComponent({
  setup() {
    const store = useImageResStore();
    const { imageRes } = storeToRefs(store);

    onBeforeMount(() => store.init());

    return () => (
      <div id="gallery">
        <div class="flex flex-wrap">
          {imageRes.value.map(({ id, url, w, h }) => {
            return <Photo url={url} width={w} height={h} key={id} />;
          })}
        </div>
      </div>
    );
  },
});

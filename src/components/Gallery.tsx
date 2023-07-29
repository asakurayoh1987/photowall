import { useImageResStore } from '@/store';
import { storeToRefs } from 'pinia';
import { defineComponent, onBeforeMount, onMounted } from 'vue';

import Photo from '@/components/Photo';
import { useToast } from '@/components/toast';

export default defineComponent({
  setup() {
    const store = useImageResStore();
    const { imageRes } = storeToRefs(store);
    const toast = useToast();

    onBeforeMount(() => store.init());

    onMounted(() => toast('loaded'));

    return () => (
      <div id="gallery">
        <div class="flex flex-wrap">
          {imageRes.value.map(({ id, url, width, height }) => {
            return <Photo url={url} width={width} height={height} key={id} />;
          })}
        </div>
      </div>
    );
  },
});

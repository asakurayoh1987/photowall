import { defineComponent, onBeforeMount, ref, toRefs } from 'vue';

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const scaleRadio = 0.6;
    // const loaded = ref(false);
    const { url, width, height } = toRefs(props);

    const imgElem = ref();

    onBeforeMount(() => {
      const imgToLoad = new Image();
      imgToLoad.onload = () => {
        imgElem.value.src = url.value;
      };
      imgToLoad.src = url.value;
    });

    return () => (
      <img
        // class="grow shrink"
        class=" bg-gray-400 bg-img-loading bg-no-repeat bg-center bg-[length:100px_100px]"
        ref={imgElem}
        width={width.value * scaleRadio}
        height={height.value * scaleRadio}
      />
    );
  },
});

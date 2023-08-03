import { defineComponent, onBeforeMount, ref, toRefs } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
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
    const { id, url, width, height } = toRefs(props);

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
        id={id.value}
        class=" bg-gray-400 bg-img-loading bg-no-repeat bg-center bg-[length:100px_100px]"
        ref={imgElem}
        width={width.value}
        height={height.value}
      />
    );
  },
});

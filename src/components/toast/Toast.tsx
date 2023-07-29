import { defineComponent, Transition } from 'vue';
import styles from './Toast.module.less';

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    return () => (
      <Transition
        enterActiveClass={styles.fadeEnterActive}
        enterFromClass={styles.fadeEnterFrom}
        leaveActiveClass={styles.fadeLeaveActive}
        leaveToClass={styles.fadeLeaveTo}
      >
        {props.show && <div class={styles.toast}>{props.message}</div>}
      </Transition>
    );
  },
});

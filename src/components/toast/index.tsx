import { createApp, ref } from 'vue';
import Toast from './Toast';

let toastInstance: any;

const _message = ref('');
const _show = ref(false);

let timer: ReturnType<typeof setTimeout>;

function createInstance() {
  if (toastInstance) return;
  const app = createApp({
    setup() {
      return () => <Toast message={_message.value} show={_show.value}></Toast>;
    },
  });

  const toastContainer = document.createElement('div');
  document.body.appendChild(toastContainer);
  toastInstance = app.mount(toastContainer);
}

export const useToast = () => {
  return (message: string, duration: number = 3000) => {
    !toastInstance && createInstance();

    if (timer) {
      clearTimeout(timer);
    }

    _message.value = message;
    _show.value = true;

    timer = setTimeout(() => {
      _show.value = false;
    }, duration);
  };
};

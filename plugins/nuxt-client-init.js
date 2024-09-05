import { boilerplateStore } from '../store';

export default async () => {
  boilerplateStore.dispatch('setViewportSize', {
    height: window.innerHeight,
    width: window.innerWidth,
  });
  window.onresize = () => {
    boilerplateStore.dispatch('setViewportSize', {
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };
};

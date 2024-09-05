import { createStore } from 'vuex';
import { viewportModule } from './viewport';

export const boilerplateStore = createStore({
  modules: {
    viewport: viewportModule,
  },
});

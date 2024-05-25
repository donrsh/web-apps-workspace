import { TmpAuthorization } from "../types";
import { create } from "zustand";

export type CreateTmpAuthorizationStoreOptions = {
  /**
   * in milliseconds
   * */
  expireTime: number;
  /**
   * in milliseconds
   * */
  watchExpireIntervalDelay?: number;
};

export const createTmpAuthorizationStore = <Auth = any>({
  expireTime,
  watchExpireIntervalDelay = 1000,
}: CreateTmpAuthorizationStoreOptions) =>
  create<TmpAuthorization<Auth>>()((set, get) => {
    let _startTimestamp: number | null = null;
    let _intervalId: number | null = null;

    const clear = () => {
      _startTimestamp = null;
      set({ current: null });
    };

    const watchExpire = () => {
      _startTimestamp = Date.now();

      if (typeof _intervalId === "number") {
        clearInterval(_intervalId);
      }

      _intervalId = window.setInterval(() => {
        if (typeof _startTimestamp !== "number") {
          clearInterval(_intervalId as any);
          return;
        }

        if (Date.now() - _startTimestamp > expireTime) {
          clear();
          return;
        }
      }, watchExpireIntervalDelay);
    };

    return {
      isPrompting: false,
      prompt() {
        set({ isPrompting: true });
      },

      promptConfirm(auth: Auth) {
        if (!get().isPrompting) {
          console.warn(
            "[TmpAuthorizationStore] store.isisPrompting is `false` now. This is no-op."
          );
          return;
        }

        watchExpire();
        set({ isPrompting: false, current: auth });
      },

      promptCancel() {
        if (!get().isPrompting) {
          console.warn(
            "[TmpAuthorizationStore] store.isisPrompting is `false` now. This is no-op."
          );

          return;
        }

        set({ isPrompting: false });
      },

      current: null,

      clear,

      prolong(ms) {
        if (typeof _startTimestamp !== "number") {
          return null;
        }

        _startTimestamp += ms;
      },

      getTimeToExpire() {
        if (typeof _startTimestamp !== "number") {
          return null;
        }

        const result = _startTimestamp + expireTime - Date.now();
        return result > 0 ? result : null;
      },
    };
  });

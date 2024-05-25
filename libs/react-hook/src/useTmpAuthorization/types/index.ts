export type TmpAuthorization<Auth = any> = {
  prompt(): void;
  isPrompting: boolean;
  promptConfirm(auth: Auth): void;
  promptCancel(): void;

  current: Auth | null;
  clear(): void;
  prolong(ms: number): void;
  getTimeToExpire(): number | null;
};

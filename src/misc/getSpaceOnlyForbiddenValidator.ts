export const getSpaceOnlyForbiddenRule =
  (message: string = 'Please do not use spaces only!') =>
  (_: unknown, value: string) =>
    !value || value.trim() ? Promise.resolve() : Promise.reject(new Error(message))

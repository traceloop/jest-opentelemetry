let defaultOptionsValue = { timeout: 500 };

export const setDefaultOptions = (options: any) => {
  defaultOptionsValue = options;
};

export const getDefaultOptions = () => {
  return defaultOptionsValue;
};

export const defaultOptions = (options: any) => ({
  ...getDefaultOptions(),
  ...options,
});

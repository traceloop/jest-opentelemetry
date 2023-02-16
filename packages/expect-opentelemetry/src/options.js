let defaultOptionsValue = { timeout: 500 };

export const setDefaultOptions = (options) => {
  defaultOptionsValue = options;
};

export const getDefaultOptions = () => {
  return defaultOptionsValue;
};

export const defaultOptions = (options) => ({
  ...getDefaultOptions(),
  ...options,
});

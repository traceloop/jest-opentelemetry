export const getInstanceType = (instance: any) => {
  if (
    instance?.constructor?.name &&
    ['Span', 'Service'].includes(instance.constructor.name)
  ) {
    return instance.constructor.name;
  }

  return null;
};

export const enhanceError = (error: any, message: string) => {
  error.message = `${message}\n${error.message}`;
  return error;
};

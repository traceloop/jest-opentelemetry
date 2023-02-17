export const getInstanceType = (instance) => {
  console.log(instance);
  console.log(instance?.constructor?.name);
  if (
    instance?.constructor?.name &&
    ['Span', 'Service'].includes(instance.constructor.name) &&
    instance.$
  ) {
    return instance.constructor.name;
  }

  return null;
};

export const getContext = async (instance, pageFunction) => {
  const type = getInstanceType(instance);
  switch (type) {
    case 'Span':
    case 'Service':
      return {
        instance,
      };
    default:
      throw new Error(`${type} is not implemented`);
  }
};

export const enhanceError = (error, message) => {
  error.message = `${message}\n${error.message}`;
  return error;
};

const isRegExp = (input) =>
  Object.prototype.toString.call(input) === '[object RegExp]';

export const expandSearchExpr = (expr) => {
  if (isRegExp(expr)) return { text: null, regexp: expr.toString() };
  if (typeof expr === 'string') return { text: expr, regexp: null };
  return { text: null, regexp: null };
};

import { TracesData } from './proto';

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

export const parseServerResponse = (data: any) => {
  const tracesBinary = Buffer.from(data.traces, 'base64');
  const traces = TracesData.decode(tracesBinary);
};

export const generateStubData = () => {
  return TracesData.create({});
};

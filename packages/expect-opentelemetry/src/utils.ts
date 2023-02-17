import { Root, load } from 'protobufjs';

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

  load('./proto/trace.proto', function (err, root) {
    if (err) throw err;
    if (!root) throw new Error('root is undefined');

    const TracesData = root.lookupType(
      'opentelemetry.proto.trace.v1.TracesData',
    );

    const decoded = TracesData.decode(tracesBinary);
    console.log(`decoded = ${JSON.stringify(decoded)}`);
  });
};

export const generateStubData = () => {
  console.log('generateStubData');
  console.log('__dirname', __dirname);

  const root = new Root();
  root.resolvePath = (origin, target) => {
    console.log(`origin: ${origin}, target: ${target}`);
    return `${__dirname}/proto/` + target;
  };

  root.loadSync('trace/v1/trace.proto');

  const TracesData = root.lookupType('opentelemetry.proto.trace.v1.TracesData');

  console.log('TracesData', TracesData);

  return TracesData.create();
};

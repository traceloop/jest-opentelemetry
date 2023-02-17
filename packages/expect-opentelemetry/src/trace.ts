import axios from 'axios';
import { setTimeout } from 'timers/promises';

export async function trace(fn: () => Promise<void>) {
  await fn();
  const t = new Trace();
  await t.getTraces();
  return t;
}

export class Trace {
  async getTraces() {
    await setTimeout(2000);
    return axios.get('http://localhost:4123/v1/traces');
  }
}

// jsdom doesn't expose TextEncoder/TextDecoder, which react-router v7 requires
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, { TextEncoder, TextDecoder });

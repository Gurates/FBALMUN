import { handleApplicationRequest } from '../../server/application-api';

export const handler = async (event: {httpMethod:string; headers:Record<string,string | undefined>; body:string | null; isBase64Encoded?:boolean}) => {
  const headers = Object.fromEntries(Object.entries(event.headers).map(([key,value]) => [key.toLowerCase(),value]));
  const body = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  return handleApplicationRequest(event.httpMethod, headers, body, process.env);
};

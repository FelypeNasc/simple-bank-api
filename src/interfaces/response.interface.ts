export interface ResponseStandard {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: object;
  statusCode?: number;
}

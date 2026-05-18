export function successResponse(message: string, data: any) {
  return { status: 'success', message, data };
}

export function failResponse(message: string, data?: any) {
  return { status: 'fail', message, data };
}

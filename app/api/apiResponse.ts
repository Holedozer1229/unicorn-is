export function success(data: any) {
  return Response.json({ success: true, ...data });
}

export function error(message: string, status = 500, extra?: any) {
  return Response.json(
    { success: false, message, ...extra },
    { status }
  );
}

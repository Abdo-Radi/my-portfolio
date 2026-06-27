// Always evaluated at request time so the timestamp is fresh and the
// endpoint reflects live instance health (never statically cached).
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

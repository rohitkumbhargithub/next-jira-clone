export function GET(
    req: Request,
    { params } : { params: { userId: String}}
){
    return Response.json({ userId: params.userId});
}
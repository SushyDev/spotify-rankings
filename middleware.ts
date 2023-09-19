import type { RequestContext } from '@vercel/edge';
 
export const config = {
  matcher: '/',
};
 
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
 
async function getProduct() {
  const res = await fetch('https://api.vercel.app/products/1');
  await wait(10000);
  return res.json();
}
 
export default function middleware(request: Request, context: RequestContext) {
  context.waitUntil(getProduct().then((json) => console.log({ json })));
 
  return new Response(
    JSON.stringify({ hello: 'world' }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    },
  );
}

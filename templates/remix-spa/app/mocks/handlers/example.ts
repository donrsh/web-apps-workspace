import { http, HttpResponse } from "msw";

const handlers = [
  http.get("/mock/example/pi", () => {
    return HttpResponse.json(3.1415962);
  }),
];

export default handlers;

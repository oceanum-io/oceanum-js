/*
Service worker for interacting with the Datamesh metadata server
*/

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("datamesh");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("datamesh");
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    return new Response("Datamesh error: " + error.message, {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
    })
  );
});

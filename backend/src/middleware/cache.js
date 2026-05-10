import NodeCache from 'node-cache';

export const cache = new NodeCache();

export const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) return res.json(cached);
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body, duration);
    return originalJson(body);
  };
  next();
};

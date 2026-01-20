from functools import lru_cache, wraps
from time import time
from typing import Any, Callable, Optional

# TTL cache - stores results with automatic expiration
class TTLCache:
    def __init__(self):
        self._cache = {}
        self._timestamps = {}
    
    def get(self, key: str, ttl: Optional[int] = None) -> Optional[Any]:
        if key not in self._cache:
            return None
        
        # Check if expired
        if ttl and key in self._timestamps:
            if time() - self._timestamps[key] > ttl:
                del self._cache[key]
                del self._timestamps[key]
                return None
        
        return self._cache[key]
    
    def set(self, key: str, value: Any) -> None:
        self._cache[key] = value
        self._timestamps[key] = time()
    
    def clear(self):
        self._cache.clear()
        self._timestamps.clear()
    
    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]
        if key in self._timestamps:
            del self._timestamps[key]

ttl_cache = TTLCache()

def cached_with_ttl(ttl: int = 60, key_prefix: str = ""):
    """Decorator to cache function results with TTL"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Build cache key from function name + args
            cache_key = f"{key_prefix}:{func.__name__}"
            if args:
                cache_key += f":{':'.join(str(arg) for arg in args)}"
            if kwargs:
                cache_key += f":{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"
            
            # Check cache first
            cached_value = ttl_cache.get(cache_key, ttl)
            if cached_value is not None:
                return cached_value
            
            # Cache miss - call function and store result
            result = func(*args, **kwargs)
            ttl_cache.set(cache_key, result)
            return result
        
        return wrapper
    return decorator

def invalidate_cache(key_prefix: str = ""):
    """Remove all cached items matching prefix"""
    keys_to_delete = [k for k in ttl_cache._cache.keys() if k.startswith(key_prefix)]
    for key in keys_to_delete:
        ttl_cache.delete(key)

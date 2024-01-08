from typing import Any, Hashable
from functools import reduce

def dig(d: dict, *keys: list[Hashable], default=None):
    """Dig for a value in a dict. Behaves similarly to ruby's `Hash.dig` method

    Args:
        d (dict)
        default (any)

    Returns:
        Union[Any, None]
    """
    try:
        return reduce(dict.get, keys, d)
    except:
        return default

def digs(d: dict, keys_to_split: str, default: Any = None, delim: str = "."):
    """Like `dig` but takes a string which is split on a delimiter (`.` by default)

    Args:
        d (dict):
        keys_to_split (str): Delimited string containing individual keys to drill for in the dict
        default (Any, optional): The value returned if the keys do not yield a valute
        delim (str, optional): The delimiting value on which the key string is split

    Returns:
        Any
    """
    return dig(d, *keys_to_split.split(delim), default=default)

def extract(d: dict, *keys) -> dict:
    """Return a subset of key-value pairs akin to ruby's Hash#slice method

    Args:
        d (dict)

    Returns:
        dict
    """
    return {k: v for k, v in d.items() if k in keys}

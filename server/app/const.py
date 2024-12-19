import os

if os.getenv("ENV", "").startswith("dev"):
    from dotenv import load_dotenv

    load_dotenv()

USER_AGENT = os.environ["MOXFIELD_USER_AGENT"]
ACCEPT = "application/json"
COLOR_MAP = {"white": "w", "blue": "u", "black": "b", "red": "r", "green": "g"}

# middleware.py
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.auth import AuthMiddlewareStack

@database_sync_to_async
def get_user_from_query_string(query_string):
    parsed_qs = parse_qs(query_string.decode())
    token_key = parsed_qs.get("token", None)
    print("token_key", token_key)
    if token_key:
        try:
            token = Token.objects.get(key=token_key[0])
            return token.user
        except Token.DoesNotExist:
            return AnonymousUser()
    return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Extract the token from the query string and try to authenticate the user
        scope['user'] = await get_user_from_query_string(scope['query_string'])
        user = scope['user']
        print("user", user)
        # Call the inner application (next middleware or consumer)
        return await self.inner(scope, receive, send)

# This function is needed to simplify the instantiation of the middleware
def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
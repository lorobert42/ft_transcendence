from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from urllib.parse import parse_qsl
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user(validated_token):
    try:
        user = get_user_model().objects.get(id=validated_token["user_id"])
        return user
    except User.DoesNotExist:
        raise Exception('User not authenticated')


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def auth(self, query):
        params = dict(parse_qsl(query))
        token = params.get('token')
        decoded_data = jwt_decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        return await get_user(validated_token=decoded_data)

    async def __call__(self, scope, receive, send):
        query = scope['query_string'].decode('utf-8')
        try:
            scope['user'] = await self.auth(query)
        except Exception:
            return None
        return await super().__call__(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))

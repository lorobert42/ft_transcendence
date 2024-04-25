from .settings_base import *
from decouple import config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-az5^_+u4w29%i6=_afv_riijgahq*^)&no92y(g90d%wabl3hx'

SIMPLE_JWT = {
    'SIGNING_KEY': 'django-insecure-az5^_+u4w29%i6=_afv_riijgahq*^)&no92y(g90d%wabl3hx',
}

ALLOWED_HOSTS = [
    'localhost',
    '192.168.1.103',
]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

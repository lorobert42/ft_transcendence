from .settings_base import *
from decouple import config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default=None)

SIMPLE_JWT = {
    'SIGNING_KEY': config('SIGNING_KEY', default=None),
}

ALLOWED_HOSTS = [
    'localhost'
]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

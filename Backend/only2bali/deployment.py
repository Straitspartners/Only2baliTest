import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS=['pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net']
CSRF_TRUSTED_ORIGINS=['https://'+os.environ['pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net']]
DEBUG=False
SECRET_KEY = os.environ['MY_SECRET_KEY']

MIDDLEWARE=[
	
    "django.middleware.security.SecurityMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
]


CORS_ALLOWED_ORIGINS=['https://happy-dune-02aab6b00.6.azurestaticapps.net']

#DJANGO VERSION 4.2
STORAGES={
	"default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
	
}

CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
if not CONNECTION:
    raise ValueError("AZURE_POSTGRESQL_CONNECTIONSTRING environment variable is not set")

# Parse the connection string into a dictionary
CONNECTION_STR = {}

# Split by spaces to separate key-value pairs
for pair in CONNECTION.split(' '):
    key_value = pair.split('=')
    if len(key_value) == 2:
        CONNECTION_STR[key_value[0]] = key_value[1]
    else:
        raise ValueError(f"Invalid connection string format: {pair}")

# Now you can define your DATABASES configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": CONNECTION_STR.get('dbname'),
        "HOST": 'localhost',
        "USER": CONNECTION_STR.get('user'),
        "PASSWORD": CONNECTION_STR.get('password'),
        "PORT": CONNECTION_STR.get('port', '5432'),  # Default to 5432 if not provided
    }
}

STATIC_ROOT = BASE_DIR/'staticfiles'

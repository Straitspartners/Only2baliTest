"""
WSGI config for only2bali project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

# import os

# from django.core.wsgi import get_wsgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "only2bali.settings")

# application = get_wsgi_application()


import os

from django.core.wsgi import get_wsgi_application
settings_module = 'only2bali.deployment' if 'pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net' in os.environ else 'only2bali.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()

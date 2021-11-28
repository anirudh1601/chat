"""
ASGI config for chat1 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.conf.urls import url
from django.urls import path,include
from chat.consumers import *
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat1.settings')

application = ProtocolTypeRouter({
    "https": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
        	chat.routing.websocket_urlpatterns,
        )
    )
})

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/users/', include('users.urls', namespace='users')),
    path('api/posts/', include('posts.urls', namespace='posts')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from .views import (
    PostListView,
    PostDetailView, PostCreateView, PostUpdateView, ToggleLikeView
)

app_name = 'posts'

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('create/', PostCreateView.as_view(), name='post_create'),
    path('<slug:slug>/', PostDetailView.as_view(), name='post_detail'),
    path('<slug:slug>/edit/', PostUpdateView.as_view(), name='post_update'),
    path('<slug:slug>/toggle-like/', ToggleLikeView.as_view(), name='toggle_like'),
]

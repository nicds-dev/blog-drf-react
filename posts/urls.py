from django.urls import path
from .views import (
    CategoryListView, PostListView, FeaturedPostView, UserPostView,
    ToggleLikeView, PostLikesListView,
    PostDetailView, PostCreateView, PostUpdateView, PostDeleteView
)

app_name = 'posts'

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('featured/', FeaturedPostView.as_view(), name='featured_post'),
    path('categories/', CategoryListView.as_view(), name='list_category'),

    path('user/<str:username>/', UserPostView.as_view(), name='user_post_list'),
    path('<slug:slug>/', PostDetailView.as_view(), name='post_detail'),
    path('<slug:slug>/toggle-like/', ToggleLikeView.as_view(), name='toggle_like'),
    path('<slug:slug>/likes/', PostLikesListView.as_view(), name='post_likes_list'),

    path('create/', PostCreateView.as_view(), name='post_create'),
    path('<slug:slug>/edit/', PostUpdateView.as_view(), name='post_update'),
    path('<slug:slug>/delete/', PostDeleteView.as_view(), name='post_delete'),
]

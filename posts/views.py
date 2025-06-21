from django.shortcuts import get_object_or_404
from django.db import models
from django_filters import rest_framework as filters
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from users.models import CustomUser
from users.serializers import UserSerializer
from .models import Post, Like, Category
from .serializers import PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer, CategorySerializer
from .utils.filters import PostFilter


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(status='published') \
        .select_related('author', 'category') \
        .prefetch_related('hashtags', 'likes')

    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PostFilter

    def get_serializer_context(self):
        return {'request': self.request}


class PostLikesListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        slug = self.kwargs['slug']
        post = get_object_or_404(Post, slug=slug)
        return CustomUser.objects.filter(likes__post=post)


class FeaturedPostView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return Post.objects.filter(status='published').annotate(num_likes=models.Count('likes')) \
            .order_by('-num_likes', '-created_at') \
            .first()

    def get_serializer_context(self):
        return {'request': self.request}


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.select_related('author', 'category').prefetch_related('hashtags', 'likes')
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_serializer_context(self):
        return {'request': self.request}


class UserPostView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(CustomUser, username=username)
        return Post.objects.filter(author=user, status='published').select_related('author', 'category').prefetch_related('hashtags', 'likes')

    def get_serializer_context(self):
        return {'request': self.request}


class PostCreateView(generics.CreateAPIView):
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}


class PostUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_object(self):
        post = super().get_object()
        if post.author != self.request.user:
            raise PermissionDenied("You can only edit your own posts.")
        return post

    def get_serializer_context(self):
        return {'request': self.request}


class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_object(self):
        post = super().get_object()

        if post.author != self.request.user:
            raise PermissionDenied("You can only delete your own posts.")
        return post

    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug)

        like = Like.objects.filter(user=request.user, post=post)

        if like.exists():
            like.delete()
            return Response({'detail': 'Like removed', 'is_liked': False}, status=status.HTTP_200_OK)
        else:
            Like.objects.create(user=request.user, post=post)
            return Response({'detail': 'Post liked', 'is_liked': True}, status=status.HTTP_201_CREATED)

from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Post, Like
from .serializers import PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer


class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(status='published').select_related('author', 'category').prefetch_related('hashtags', 'likes')
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.select_related('author', 'category').prefetch_related('hashtags', 'likes')
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

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
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own posts.")
        return post

    def get_serializer_context(self):
        return {'request': self.request}


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

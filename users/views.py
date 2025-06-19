from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Follow
from .serializers import SignUpSerializer, UserProfileSerializer, UserSerializer


class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': 'You are already authenticated.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().post(request, *args, **kwargs)


class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'

    def get_object(self):
        try:
            return CustomUser.objects.get(username=self.kwargs['username'])
        except CustomUser.DoesNotExist:
            raise NotFound(detail=f'User @{self.kwargs['username']} not found.')

    def get_serializer_context(self):
        return {'request': self.request}


class UpdateProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        print(self.request.user)
        return self.request.user


class ToggleFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        current_user = request.user
        target_user = get_object_or_404(CustomUser, username=username)

        if current_user == target_user:
            return Response({'detail': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        relation = Follow.objects.filter(follower=current_user, following=target_user)

        if relation.exists():
            relation.delete()
            return Response({'detail': f'You unfollowed @{target_user.username}', 'is_following': False}, status=status.HTTP_200_OK)
        else:
            Follow.objects.create(follower=current_user, following=target_user)
            return Response({'detail': f'You followed @{target_user.username}', 'is_following': True}, status=status.HTTP_201_CREATED)


class FollowersListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        return CustomUser.objects.filter(following__following=user)


class FollowingListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(CustomUser, username=username)
        return CustomUser.objects.filter(followers__follower=user)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)

            if token['user_id'] != request.user.id:
                return Response({'detail': 'User can only logout their own session.'}, status=status.HTTP_403_FORBIDDEN)

            token.blacklist()
            return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

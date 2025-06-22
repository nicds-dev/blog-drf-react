from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser
from .serializers import SignUpSerializer, UserProfileSerializer, UserSerializer, UpdateUserSerializer, ChangePasswordSerializer
from .services.follow_service import toggle_follow


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
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class DeleteAccountView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def delete(self, request, *args, **kwargs):
        user = self.get_object()

        try:
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception:
           return Response({'detail': 'An unexpected error occurred while deleting the account.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ToggleFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        result, is_following = toggle_follow(request.user, username)

        if 'error' in result:
            return Response({'detail': result['error']}, status=status.HTTP_400_BAD_REQUEST)

        return Response({**result, 'is_following': is_following},
                        status=status.HTTP_201_CREATED if is_following else status.HTTP_200_OK)


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

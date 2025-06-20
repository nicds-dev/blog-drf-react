from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import (
    SignUpView, UserDetailView, UpdateProfileView, ChangePasswordView, DeleteAccountView, LogoutView,
    ToggleFollowView, FollowersListView, FollowingListView
)

app_name = 'users'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login_jwt'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh_jwt'),
    path('account/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('account/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('account/delete/', DeleteAccountView.as_view(), name='delete_account'),
    path('logout/', LogoutView.as_view(), name='logout_jwt'),
    path('<str:username>/', UserDetailView.as_view(), name='user_detail'),
    path('<str:username>/toggle-follow/', ToggleFollowView.as_view(), name='toggle_follow'),
    path('<str:username>/followers/', FollowersListView.as_view(), name='followers_list'),
    path('<str:username>/following/', FollowingListView.as_view(), name='following_list'),
]

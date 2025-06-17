from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import (
    SignUpView, UserDetailView, UpdateProfileView, LogoutView
)

app_name = 'users'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='jwt_login'),
    path('refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('logout/', LogoutView.as_view(), name='jwt_logout'),
    path('account/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('<str:username>/', UserDetailView.as_view(), name='user_detail'),
]

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Follow
import re


def is_followed_by(request_user, target_user):
    if request_user and request_user.is_authenticated:
        return Follow.objects.filter(follower=request_user, following=target_user).exists()
    return False


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token


class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    is_followed = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'bio', 'avatar', 'date_joined',
            'followers_count', 'following_count', 'posts_count', 'is_followed'
        ]
        read_only_fields = [
            'id', 'date_joined', 'followers_count', 'following_count', 'posts_count', 'is_followed'
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_posts_count(self, obj):
        # TODO:
        return None

    def get_is_followed(self, obj):
       return is_followed_by(self.context.get('request').user, obj)


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    is_followed = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'avatar', 'is_followed']

    def get_full_name(self, obj):
        if obj.first_name and obj.last_name:
            return f'{obj.first_name} {obj.last_name}'.strip()
        return obj.first_name

    def get_is_followed(self, obj):
        return is_followed_by(self.context.get('request').user, obj)


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'password']

    def validate_username(self, value):
        value = value.lower()
        if not re.match(r'^[\w]+$', value):  # Regular expression: letters, numbers and underscores
            raise serializers.ValidationError('Only letters, numbers and underscores(_) are allowed in the username.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = CustomUser(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance

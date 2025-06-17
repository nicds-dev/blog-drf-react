from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
import re


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token


class UserSerializer(serializers.ModelSerializer):
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
        return 0

    def get_is_followed(self, obj):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False


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

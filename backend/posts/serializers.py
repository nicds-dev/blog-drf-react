from rest_framework import serializers
from .models import Category, Hashtag, Post, Like
from .utils.slug import generate_unique_slug
from users.serializers import UserSerializer


def is_liked_by(request_user, target_post):
    if request_user and request_user.is_authenticated:
        return target_post.likes.filter(user=request_user).exists()
    return None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name']
        read_only_fields = ['id']

    def validate_name(self, value):
        return value.lower()


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content', 'image', 'category', 'hashtags']

    def create(self, validated_data):
        user = self.context['request'].user
        hashtags = validated_data.pop('hashtags', [])
        title = validated_data['title']

        post = Post.objects.create(author=user, **validated_data)
        post.slug = generate_unique_slug(title)
        post.save()

        if hashtags:
            post.hashtags.set(hashtags)

        return post

    def update(self, instance, validated_data):
        hashtags = validated_data.pop('hashtags', None)

        if 'title' in validated_data and validated_data['title'] != instance.title:
            instance.slug = generate_unique_slug(validated_data['title'], instance_id=instance.id)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if hashtags is not None:
            instance.hashtags.set(hashtags)

        instance.save()
        return instance


class PostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    hashtags = HashtagSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'slug', 'title', 'content', 'author', 'image',
            'category', 'hashtags', 'status', 'created_at',
            'likes_count', 'is_liked'
        ]

    def get_is_liked(self, obj):
        return is_liked_by(self.context.get('request').user, obj)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('is_liked') is None:
            data.pop('is_liked')
        return data


class PostDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    hashtags = HashtagSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'slug', 'title', 'content', 'author', 'image',
            'category', 'hashtags', 'status', 'created_at', 'updated_at',
            'likes_count', 'is_liked'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        return is_liked_by(self.context.get('request').user, obj)

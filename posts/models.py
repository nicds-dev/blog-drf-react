from django.db import models
from users.models import CustomUser


class Category(models.Model):
    name = models.CharField(max_length=25, unique=True)
    slug = models.SlugField(max_length=32, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Hashtag(models.Model):
    name = models.CharField(max_length=18, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"#{self.name}"


class Post(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    content = models.TextField()
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, related_name='posts')
    hashtags = models.ManyToManyField(Hashtag, blank=True, related_name='posts')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PUBLISHED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Posts'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_like')
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'

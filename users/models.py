from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, first_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email field is required.')
        if not username:
            raise ValueError('Username field is required.')
        if not first_name:
            raise ValueError('First Name field is required.')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, first_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, first_name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('email address', unique=True)
    username = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)

    bio = models.TextField('biography', max_length=180, blank=True, null=True)
    avatar = models.ImageField('avatar image', upload_to='avatars/', blank=True, null=True)

    is_active = models.BooleanField(default=True)  # Could be False for email verification
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name']

    def __str__(self):
        return f'@{self.username}'

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'


class Follow(models.Model):
    follower = models.ForeignKey(CustomUser, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(CustomUser, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['follower', 'following'], name='unique_follow')
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.follower} follows {self.following}'

    def clean(self):
        if self.follower == self.following:
            raise ValidationError('Users cannot follow themselves.')

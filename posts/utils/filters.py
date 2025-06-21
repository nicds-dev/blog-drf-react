from django_filters import rest_framework as filters
from posts.models import Post

class PostFilter(filters.FilterSet):
    category = filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    hashtag = filters.CharFilter(method='filter_by_hashtag')
    author = filters.CharFilter(field_name='author__username', lookup_expr='iexact')
    search = filters.CharFilter(method='filter_by_title')

    class Meta:
        model = Post
        fields = ['category', 'hashtag', 'author', 'search']

    def filter_by_hashtag(self, queryset, name, value):
        return queryset.filter(hashtags__name__iexact=value)

    def filter_by_title(self, queryset, name, value):
        return queryset.filter(title__icontains=value)

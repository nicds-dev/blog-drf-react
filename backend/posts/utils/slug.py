import re
from django.utils.text import slugify
from posts.models import Post

# English stopword but can be in any other language.

STOPWORDS = {
    'the', 'a', 'an',
    'in', 'on', 'at', 'by', 'with', 'from', 'into', 'onto',
    'and', 'but', 'or', 'nor', 'so', 'yet',
    'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
    'of', 'to', 'for', 'it', 'this', 'that', 'these', 'those',
    'as', 'if', 'than', 'too', 'very', 'just', 'not',
}

def generate_slug(title: str) -> str:
    title = title.lower()

    words = re.findall(r'\w+', title)
    filtered_words = [word for word in words if word not in STOPWORDS]
    clean_title = ' '.join(filtered_words)
    return slugify(clean_title)

def generate_unique_slug(title: str, instance_id=None) -> str:
    base_slug = generate_slug(title)
    slug = base_slug
    i = 1

    while Post.objects.filter(slug=slug).exclude(id=instance_id).exists():
        slug = f'{base_slug}-{i}'
        i += 1

    return slug

import re
from django.utils.text import slugify
from posts.models import Post

STOPWORDS_ES = {
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'a', 'de', 'para', 'en', 'con', 'sobre', 'entre', 'por', 'sin', 'hacia', 'desde', 'hasta', 'tras',
    'y', 'o', 'pero', 'aunque', 'porque', 'si', 'ni', 'mientras',
}

def generate_slug(title: str) -> str:
    title = title.lower()

    words = re.findall(r'\w+', title)
    filtered_words = [word for word in words if word not in STOPWORDS_ES]
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

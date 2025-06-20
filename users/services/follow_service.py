from django.shortcuts import get_object_or_404
from users.models import CustomUser, Follow

def toggle_follow(current_user, target_username):
    target_user = get_object_or_404(CustomUser, username=target_username)

    if current_user == target_user:
        return {'error': 'You cannot follow yourself.'}, False

    relation = Follow.objects.filter(follower=current_user, following=target_user)

    if relation.exists():
        relation.delete()
        return {'detail': f'You unfollowed @{target_user.username}'}, False
    else:
        Follow.objects.create(follower=current_user, following=target_user)
        return {'detail': f'You followed @{target_user.username}'}, True

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review
from providers.models import ProviderProfile

@receiver([post_save, post_delete], sender=Review)
def update_provider_rating(sender, instance, **kwargs):
    provider_profile = instance.provider
    reviews = Review.objects.filter(provider=provider_profile)
    
    if reviews.exists():
        average = reviews.aggregate(Avg('rating'))['rating__avg']
        count = reviews.count()
        provider_profile.average_rating = round(average, 2)
        provider_profile.review_count = count
    else:
        provider_profile.average_rating = 0.0
        provider_profile.review_count = 0
        
    provider_profile.save()
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Booking

class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'service', 'booking_time', 'status')
    list_filter = ('status', 'booking_time')
    search_fields = ('customer__username', 'service__name')

    # This is the key line that makes the status field editable in the list
    list_editable = ('status',)

admin.site.register(Booking, BookingAdmin)
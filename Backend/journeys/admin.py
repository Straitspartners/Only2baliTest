from django.contrib import admin
from .models import *

# Inline classes for the preferences models, now using user as the foreign key

class PlacesToVisitInline(admin.StackedInline):
    model = PlacesToVisit
    extra = 1  # Number of empty forms to display by default
    fk_name = 'journey_preferences'  # Ensure we're linking the inline to the user field

class FoodPreferencesInline(admin.StackedInline):
    model = FoodPreferences
    extra = 1  # Number of empty forms to display by default
    fk_name = 'journey_preferences'  # Ensure we're linking the inline to the user field

class StayPreferencesInline(admin.StackedInline):
    model = StayPreferences
    extra = 1
    fk_name = 'journey_preferences'

class TravelDetailsInline(admin.StackedInline):
    model = TravelDetails
    extra = 1
    fk_name = 'journey_preferences'

class VehiclePreferencesInline(admin.StackedInline):
    model = VehiclePreferences
    extra = 1
    fk_name = 'journey_preferences'

class TourGuidePreferencesInline(admin.StackedInline):
    model = TourGuidePreferences
    extra = 1
    fk_name = 'journey_preferences'

class CateringOrChefInline(admin.StackedInline):
    model = CateringOrChef
    extra = 1
    fk_name = 'journey_preferences'

class PaperworkAssistanceInline(admin.StackedInline):
    model = PaperworkAssistance
    extra = 1
    fk_name = 'journey_preferences'

class VendorInline(admin.StackedInline):
    model = Vendor
    extra = 1
    fk_name = 'journey_preferences'

class ExtraRequestsInline(admin.StackedInline):
    model = ExtraRequests
    extra = 1
    fk_name = 'journey_preferences'

# Main JourneyPreferences Admin
class JourneyPreferencesAdmin(admin.ModelAdmin):
    inlines = [
        FoodPreferencesInline,
        StayPreferencesInline,
        TravelDetailsInline,
        VehiclePreferencesInline,
        TourGuidePreferencesInline,
        CateringOrChefInline,
        PaperworkAssistanceInline,
        VendorInline,
        PlacesToVisitInline, 
        ExtraRequestsInline,
    ]

    # Optionally, you can customize list display, filters, etc.
    list_display = ('user', 'name', 'age','crew_type','confirmed')
    search_fields = ('name', 'occupation', 'user__username')  # Search by user (CustomUser's username)

# Register the JourneyPreferences model with the admin panel
admin.site.register(JourneyPreferences, JourneyPreferencesAdmin)
admin.site.register(Place)
admin.site.register(StayType)
admin.site.register(VegetarianChoice)
admin.site.register(NonVegetarianChoice)
admin.site.register(DietaryChoice)
admin.site.register(BalineseChoice)
admin.site.register(VehicleType)
admin.site.register(Language)
admin.site.register(AssistanceType)
admin.site.register(VendorType)


from django.db import models
from users.models import CustomUser  # Ensure the CustomUser model is correctly defined and imported

# 5. Journey Preferences Model
class JourneyPreferences(models.Model):
    CREW_TYPE_CHOICES = [
        ('business_partners', 'Business Partners'),
        ('corporate_meeting', 'Corporate Meeting'),
        ('team_bonding', 'Team Bonding'),
        ('alumni_meeting', 'Alumni Meeting'),
        ('friends_get_together', 'Friends Get-Together'),
        ('family', 'Family'),
        ('new_couple', 'New Couple'),
        ('family_get_together', 'Family Get-Together'),
        ('others', 'Others'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    occupation = models.CharField(max_length=150)
    number_of_people = models.IntegerField(default=1)
    times_visited_bali = models.CharField(max_length=150)
    crew_type = models.CharField(max_length=50, choices=CREW_TYPE_CHOICES)
    crew_type_others = models.CharField(max_length=150, blank=True, null=True)
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}'s Journey Preferences"


# 6. Places to Visit Model
class Place(models.Model):
    PLACES_CHOICES = [
        ('Natural Beauty and Beaches', 'Natural Beauty and Beaches'),
        ('Local Cultures and Traditions', 'Local Cultures and Traditions'),
        ('Wellness and Relaxation', 'Wellness and Relaxation'),
        ('Wedding and Pre-Wedding', 'Wedding and Pre-Wedding'),
        ('Adventures and Activities', 'Adventures and Activities'),
        ('Local Culinary', 'Local Culinary'),
        ('Shopping in Bali', 'Shopping in Bali'),
        ('Luxury and Unique Experiences', 'Luxury and Unique Experiences'),
        ('Others', 'Others'),
    ]

    place_name = models.CharField(max_length=255, choices=PLACES_CHOICES, unique=True)

    def __str__(self):
        places= dict(self.PLACES_CHOICES).get(self.place_name, self.place_name)
        return f"ID: {self.id}, Places : {places}"

class PlacesToVisit(models.Model):
    journey_preferences = models.ForeignKey(JourneyPreferences, on_delete=models.CASCADE)
    place = models.ManyToManyField(Place)
    others_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{', '.join([str(p) for p in self.place.all()])} for {self.journey_preferences.name}"
    
# 7. Travel Details Model
class TravelDetails(models.Model):
    AIRPORT_CHOICES = [
    ('Indira Gandhi International Airport (Delhi)', 'Indira Gandhi International Airport (Delhi)'),
    ('Chhatrapati Shivaji Maharaj International Airport (Mumbai)', 'Chhatrapati Shivaji Maharaj International Airport (Mumbai)'),
    ('Kempegowda International Airport (Bangalore)', 'Kempegowda International Airport (Bangalore)'),
    ('Netaji Subhas Chandra Bose International Airport (Kolkata)', 'Netaji Subhas Chandra Bose International Airport (Kolkata)'),
    ('Chennai International Airport (Chennai)', 'Chennai International Airport (Chennai)'),
    ('Rajiv Gandhi International Airport (Hyderabad)', 'Rajiv Gandhi International Airport (Hyderabad)'),
    ('Sardar Vallabhbhai Patel International Airport (Ahmedabad)', 'Sardar Vallabhbhai Patel International Airport (Ahmedabad)'),
]

    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    from_date = models.DateField()
    to_date = models.DateField()
    international_airport = models.CharField(max_length=100 , choices=AIRPORT_CHOICES)
    flight_class = models.CharField(max_length=50)

    def __str__(self):
        return f"Travel Details for {self.journey_preferences.name}"


# 8. Stay Preferences Model
class StayType(models.Model):
    STAY_TYPE_CHOICES = [
        ('Hotel', 'Hotel'),
        ('Motel', 'Motel'),
        ('Villa', 'Villa'),
        ('Cottage', 'Cottage'),
        ('Apartment', 'Apartment'),
        ('Guesthouse', 'Guesthouse'),
    ]
    stay_type_name = models.CharField(max_length=50, choices=STAY_TYPE_CHOICES, unique=True)

    def __str__(self):
        # Get the display name from STAY_TYPE_CHOICES using the stay_type_name
        stay_type_display = dict(self.STAY_TYPE_CHOICES).get(self.stay_type_name, self.stay_type_name)
        
        # Return the id along with the display name
        return f"ID: {self.id}, Stay Type: {stay_type_display}"


class StayPreferences(models.Model):
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    stay_type = models.ManyToManyField(StayType)

    def __str__(self):
        return f"{', '.join([str(st) for st in self.stay_type.all()])} for {self.journey_preferences.name}"


# 9. Food Preferences Model
class VegetarianChoice(models.Model):
    VEGETARIAN_CHOICES = [
        ('North Indian Vegetarian', 'North Indian Vegetarian'),
        ('South Indian Vegetarian', 'South Indian Vegetarian'),
        ('Gujarati Vegetarian', 'Gujarati Vegetarian'),
        ('Jain Vegetarian', 'Jain Vegetarian')
    ]
    
    choice_name = models.CharField(max_length=50, choices=VEGETARIAN_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Vegetarian Choice: {self.choice_name}"


class NonVegetarianChoice(models.Model):
    NON_VEGETARIAN_CHOICES = [
        ('North Indian Non-Vegetarian', 'North Indian Non-Vegetarian'),
        ('South Indian Non-Vegetarian', 'South Indian Non-Vegetarian')
    ]
    
    choice_name = models.CharField(max_length=50, choices=NON_VEGETARIAN_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Non-Vegetarian Choice: {self.choice_name}"


class DietaryChoice(models.Model):
    DIETARY_CHOICES = [
        ('Vegan', 'Vegan'),
        ('Keto', 'Keto'),
        ('Halal', 'Halal'),
        ('Souvenir Foods', 'Souvenir Foods'),
    ]
    
    choice_name = models.CharField(max_length=50, choices=DIETARY_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Dietary Choice: {self.choice_name}"


class BalineseChoice(models.Model):
    BALINESE_CHOICES = [
        ('Jimbaran Seafood', 'Jimbaran Seafood'),
        ('Balinese Culinary', 'Balinese Culinary'),
        ('Indonesian Food', 'Indonesian Food'),
        ('Local Snacks', 'Local Snacks'),
        
    ]
    
    choice_name = models.CharField(max_length=50, choices=BALINESE_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Balinese Choice: {self.choice_name}"


class FoodPreferences(models.Model):
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
    vegetarian_choice = models.ManyToManyField(VegetarianChoice)  # Many-to-many for vegetarian choices
    non_vegetarian_choice = models.ManyToManyField(NonVegetarianChoice)  # Many-to-many for non-vegetarian choices
    dietary_choice = models.ManyToManyField(DietaryChoice)  # Many-to-many for dietary choices
    balinese_choice = models.ManyToManyField(BalineseChoice)  # Many-to-many for Balinese choices
    other_preferences = models.TextField(blank=True, null=True)

    def __str__(self):
        preferences = []
        if self.vegetarian_choice.exists():
            preferences.append(f"Vegetarian: {', '.join([str(choice) for choice in self.vegetarian_choice.all()])}")
        if self.non_vegetarian_choice.exists():
            preferences.append(f"Non-Vegetarian: {', '.join([str(choice) for choice in self.non_vegetarian_choice.all()])}")
        if self.dietary_choice.exists():
            preferences.append(f"Dietary: {', '.join([str(choice) for choice in self.dietary_choice.all()])}")
        if self.balinese_choice.exists():
            preferences.append(f"Balinese Dish: {', '.join([str(choice) for choice in self.balinese_choice.all()])}")
        if self.other_preferences:
            preferences.append(f"Other Preferences: {self.other_preferences}")
        
        return f"{', '.join(preferences)}"



# 10. Vehicle Preferences Model
class VehicleType(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('Motorbike (1-2 people)', 'Motorbike (1-2 people)'),
        ('Bus (>30 people)', 'Bus (>30 people)'),
        ('MiniBus (20-30 people)', 'MiniBus (20-30 people)'),
        ('Van (12-15 people)', 'Van (12-15 people)'),
        ('Car (5-10 people)', 'Car (5-10 people)'),
        ('Luxury Car (5-8 people)', 'Luxury Car (5-8 people)'),
        ('Others', 'Others')
    ]

    vehicle_type_name = models.CharField(max_length=50, choices=VEHICLE_TYPE_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Vehicle: {self.vehicle_type_name}"

 
class VehiclePreferences(models.Model):
    RENT_PERIOD_CHOICES = [
        ('1-2 Days', '1-2 Days'),
        ('>3 Days', '>3 Days'),
        ('others', 'Others')
    ]

    include_driver_choices=[('Yes','Yes'),('No','No')]

    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    vehicle = models.ManyToManyField(VehicleType)  # Changed from 'vehicle_type' to 'vehicle'
    rent_period = models.CharField(max_length=20, choices=RENT_PERIOD_CHOICES)
    other_preferences = models.TextField(blank=True, null=True)
    include_driver = models.CharField(max_length=20, choices=include_driver_choices)

    def __str__(self):
        return f"{', '.join([str(v) for v in self.vehicle.all()])} for {self.journey_preferences.name}"


# 11. Tour Guide Preferences Model
class Language(models.Model):
    LANGUAGES_CHOICES = [
        ('Tamil', 'Tamil'),
        ('English', 'English'),
        ('Hindi', 'Hindi'),
        ('Marathi', 'Marathi'),
        ('Gujarati', 'Gujarati'),
        ('Kannada', 'Kannada'),
        ('Others', 'Others'),
    ]

    language_name = models.CharField(max_length=50, choices=LANGUAGES_CHOICES, unique=True)

    def __str__(self):
        return f"ID: {self.id}, Languages Choice: {self.language_name}"


class TourGuidePreferences(models.Model):
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    preferred_languages = models.ManyToManyField(Language)
    other_language = models.CharField(max_length=100, blank=True, null=True)

    # def __str__(self):
    #     return f"{self.preferred_languages} {self.journey_preferences.name}"


# 12. Catering or Chef Model
class CateringOrChef(models.Model):
    SERVICE_CHOICES = [
        ('Personal Chef', 'Personal Chef'),
        ('Catering', 'Catering'),
        ('others', 'Other')
    ]
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"ID: {self.id}, Languages Choice: {self.service_type}"


# 13. Paperwork Assistance Model
class AssistanceType(models.Model):
    ASSISTANCE_CHOICES = [
        ('KYC Integration', 'KYC Integration'),
        ('Visa Processing Assistance', 'Visa Processing Assistance'),
        ('Travel Requirement Guidance', 'Travel Requirement Guidance'),
        ('Others', 'Others'),
    ]

    name = models.CharField(max_length=50, choices=ASSISTANCE_CHOICES, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"ID: {self.id}, Languages Choice: {self.name}"


class PaperworkAssistance(models.Model):
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    assistance_type = models.ManyToManyField(AssistanceType, blank=True)
    other_assistance_details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Paperwork Assistance for {self.journey_preferences.name}"


# 14. Vendor Model
class VendorType(models.Model):
    VENDOR_CHOICES = [
        ('Vegetable Vendor', 'Vegetable Vendor'),
        ('Utensil Vendor', 'Utensil Vendor'),
        ('Travel Agent', 'Travel Agent'),
        ('Event Organizer', 'Event Organizer'),
        ('Other', 'Other'),
    ]

    # The 'name' field will store the type of vendor
    name = models.CharField(max_length=50, choices=VENDOR_CHOICES, unique=True)
    
    # Optional description for the vendor type
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"ID: {self.id}, Vendor Type: {self.name}"

class Vendor(models.Model):
    # Foreign key to associate the vendor with a specific journey
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
    
    # Many-to-many relationship to the VendorType model
    vendor_type = models.ManyToManyField(VendorType, related_name='vendors', blank=True)
    
    # Field to provide a description when 'others' is selected as vendor type
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Vendor(s) for {self.journey_preferences.name}"

    
# 15. Extra Requests Model
class ExtraRequests(models.Model):
    journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
    requests = models.TextField()

    def __str__(self):
        return f"Extra Requests for {self.journey_preferences.name}"




# from django.db import models
# from users.models import CustomUser  # Ensure the CustomUser model is correctly defined and imported


# # 5. Journey Preferences Model
# class JourneyPreferences(models.Model):
#     CREW_TYPE_CHOICES = [
#         ('business_partners', 'Business Partners'),
#         ('corporate_meeting', 'Corporate Meeting'),
#         ('team_bonding', 'Team Bonding'),
#         ('alumni_meeting', 'Alumni Meeting'),
#         ('friends_get_together', 'Friends Get-Together'),
#         ('family', 'Family'),
#         ('new_couple', 'New Couple'),
#         ('family_get_together', 'Family Get-Together'),
#         ('others', 'Others'),
#     ]

#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     age = models.IntegerField()
#     occupation = models.CharField(max_length=150)
#     times_visited_bali = models.IntegerField(default=0)
#     crew_type = models.CharField(max_length=50, choices=CREW_TYPE_CHOICES)
#     crew_type_others = models.CharField(max_length=150, blank=True, null=True)

#     def __str__(self):
#         return f"{self.name}'s Journey Preferences"


# # 6. Places to Visit Model
# class PlacesToVisit(models.Model):
#     PLACES_CHOICES = [
#         ('natural_beauty', 'Natural Beauty and Beaches'),
#         ('local_culture', 'Local Cultures and Traditions'),
#         ('wellness_relaxation', 'Wellness and Relaxation'),
#         ('wedding_pre_wedding', 'Wedding and Pre-Wedding'),
#         ('adventures_activities', 'Adventures and Activities'),
#         ('local_culinary', 'Local Culinary'),
#         ('shopping', 'Shopping in Bali'),
#         ('luxury_experiences', 'Luxury and Unique Experiences'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.ForeignKey(JourneyPreferences, on_delete=models.CASCADE)
#     place = models.TextField(choices=PLACES_CHOICES)
#     others_description = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"{self.place} for {self.journey_preferences.name}"


# # 7. Travel Details Model
# class TravelDetails(models.Model):
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     from_date = models.DateField()
#     to_date = models.DateField()
#     international_airport = models.CharField(max_length=100)
#     flight_class = models.CharField(max_length=50)

#     def __str__(self):
#         return f"Travel Details for {self.journey_preferences.name}"


# # 8. Stay Preferences Model
# class StayPreferences(models.Model):
#     STAY_TYPE_CHOICES = [
#         ('hotel', 'Hotel'),
#         ('motel', 'Motel'),
#         ('villa', 'Villa'),
#         ('cottage', 'Cottage'),
#         ('apartment', 'Apartment'),
#         ('guesthouse', 'Guesthouse'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     stay_type = models.CharField(max_length=50, choices=STAY_TYPE_CHOICES)

#     def __str__(self):
#         return f"{self.stay_type} for {self.journey_preferences.name}"


# # 9. Food Preferences Model
# class FoodPreferences(models.Model):
#     VEGETARIAN_CHOICES = [
#         ('north_indian', 'North Indian Vegetarian'),
#         ('south_indian', 'South Indian Vegetarian'),
#         ('gujarati', 'Gujarati Vegetarian'),
#         ('jain', 'Jain Vegetarian')
#     ]

#     NON_VEGETARIAN_CHOICES = [
#         ('north_indian', 'North Indian Non-Vegetarian'),
#         ('south_indian', 'South Indian Non-Vegetarian')
#     ]

#     DIETARY_CHOICES = [
#         ('vegan', 'Vegan'),
#         ('keto', 'Keto'),
#         ('halal', 'Halal')
#     ]

#     BALINESE_CHOICES = [
#         ('jimbaran_seafood', 'Jimbaran Seafood'),
#         ('balinese_culinary', 'Balinese Culinary'),
#         ('indonesian_food', 'Indonesian Food'),
#         ('local_snacks', 'Local Snacks'),
#         ('souvenir_foods', 'Souvenir Foods')
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
#     vegetarian_choice = models.CharField(max_length=50, choices=VEGETARIAN_CHOICES, blank=True, null=True)
#     non_vegetarian_choice = models.CharField(max_length=50, choices=NON_VEGETARIAN_CHOICES, blank=True, null=True)
#     dietary_choice = models.CharField(max_length=50, choices=DIETARY_CHOICES, blank=True, null=True)
#     balinese_choice = models.CharField(max_length=50, choices=BALINESE_CHOICES, blank=True, null=True)
#     other_preferences = models.TextField(blank=True, null=True)

#     def __str__(self):
#         preferences = []
#         if self.vegetarian_choice:
#             preferences.append(f"Vegetarian: {self.vegetarian_choice}")
#         if self.non_vegetarian_choice:
#             preferences.append(f"Non-Vegetarian: {self.non_vegetarian_choice}")
#         if self.dietary_choice:
#             preferences.append(f"Dietary: {self.dietary_choice}")
#         if self.balinese_choice:
#             preferences.append(f"Balinese Dish: {self.balinese_choice}")
#         if self.other_preferences:
#             preferences.append(f"Other Preferences: {self.other_preferences}")
        
#         return ', '.join(preferences)


# # 10. Vehicle Preferences Model
# class VehiclePreferences(models.Model):
#     VEHICLE_TYPE_CHOICES = [
#         ('motorbike', 'Motorbike (1-2 people)'),
#         ('bus', 'Bus (>30 people)'),
#         ('minibus', 'MiniBus (20-30 people)'),
#         ('van', 'Van (12-15 people)'),
#         ('car', 'Car (5-10 people)'),
#         ('luxury_car', 'Luxury Car (5-8 people)'),
#     ]

#     RENT_PERIOD_CHOICES = [
#         ('1_2_days', '1-2 Days'),
#         ('more_than_3_days', '>3 Days'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     vehicle_type = models.CharField(max_length=50, choices=VEHICLE_TYPE_CHOICES)
#     rent_period = models.CharField(max_length=20, choices=RENT_PERIOD_CHOICES)
#     include_driver = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.vehicle_type} for {self.journey_preferences.name}"


# # 11. Tour Guide Preferences Model
# class TourGuidePreferences(models.Model):
#     LANGUAGES_CHOICES = [
#         ('tamil', 'Tamil'),
#         ('english', 'English'),
#         ('hindi', 'Hindi'),
#         ('marathi', 'Marathi'),
#         ('gujarati', 'Gujarati'),
#         ('kannada', 'Kannada'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     preferred_language = models.CharField(max_length=50, choices=LANGUAGES_CHOICES)
#     other_language = models.CharField(max_length=100, blank=True, null=True)

#     def __str__(self):
#         return f"Tour Guide Preferences for {self.journey_preferences.name}"


# # 12. Catering or Chef Model
# class CateringOrChef(models.Model):
#     SERVICE_CHOICES = [
#         ('personal_chef', 'Personal Chef'),
#         ('catering', 'Catering'),
#         ('others', 'Other')
#     ]
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
#     service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
#     description = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.service_type


# # 13. Paperwork Assistance Model
# class PaperworkAssistance(models.Model):
#     ASSISTANCE_CHOICES = [
#         ('kyc_integration', 'KYC Integration'),
#         ('visa_processing', 'Visa Processing Assistance'),
#         ('travel_requirements', 'Travel Requirement Guidance'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     assistance_type = models.CharField(max_length=50, choices=ASSISTANCE_CHOICES)
#     other_assistance_details = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"Paperwork Assistance for {self.journey_preferences.name}"


# # 14. Vendor Model
# class Vendor(models.Model):
#     VENDOR_CHOICES = [
#         ('vegetable', 'Vegetable Vendor'),
#         ('utensil', 'Utensil Vendor'),
#         ('travel_agent', 'Travel Agent'),
#         ('event_organizer', 'Event Organizer'),
#         ('others', 'Other')
#     ]
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE, null=True)
#     vendor_type = models.CharField(max_length=20, choices=VENDOR_CHOICES, default='other')
#     description = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.vendor_type


# # 15. Extra Requests Model
# class ExtraRequests(models.Model):
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     requests = models.TextField()

#     def __str__(self):
#         return f"Extra Requests for {self.journey_preferences.name}"





# from django.db import models
# from users.models import CustomUser

# # 5 . Then we have to select about our crew like Business Partners , 
# # Corporate meeting , Team Bonding , Alumini Meeting , Friends Get - Together ,
# # Family , New Couple , Family get - together and there will also be others option 
# # if we dont find our options here then we can type about it in others.

# class JourneyPreferences(models.Model):#single
#     CREW_TYPE_CHOICES = [
#         ('business_partners', 'Business Partners'),
#         ('corporate_meeting', 'Corporate Meeting'),
#         ('team_bonding', 'Team Bonding'),
#         ('alumni_meeting', 'Alumni Meeting'),
#         ('friends_get_together', 'Friends Get-Together'),
#         ('family', 'Family'),
#         ('new_couple', 'New Couple'),
#         ('family_get_together', 'Family Get-Together'),
#         ('others', 'Others'),
#     ]

#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     age = models.IntegerField()
#     occupation = models.CharField(max_length=150)
#     times_visited_bali = models.IntegerField(default=0)
#     crew_type = models.CharField(max_length=50, choices=CREW_TYPE_CHOICES)
#     crew_type_others = models.CharField(max_length=150, blank=True, null=True)

#     def __str__(self):
#         return f"{self.name}'s Journey Preferences"

# # 6 . Then we can select which are all the places we wanted to visit in Bali 
# # like Natural Beauty and Beaches , Local Cultures and Traditions , Wellness and 
# # Relaxation , Wedding and Pre-Wedding , Adventures and Activities , Local Culinary ,
# # Shopping in Bali , Luxury and Unique Experiences 

# class PlacesToVisit(models.Model):#multiple
#     PLACES_CHOICES = [
#         ('natural_beauty', 'Natural Beauty and Beaches'),
#         ('local_culture', 'Local Cultures and Traditions'),
#         ('wellness_relaxation', 'Wellness and Relaxation'),
#         ('wedding_pre_wedding', 'Wedding and Pre-Wedding'),
#         ('adventures_activities', 'Adventures and Activities'),
#         ('local_culinary', 'Local Culinary'),
#         ('shopping', 'Shopping in Bali'),
#         ('luxury_experiences', 'Luxury and Unique Experiences'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.ForeignKey(JourneyPreferences, on_delete=models.CASCADE)
#     place = models.TextField(choices=PLACES_CHOICES)# Use TextField for multiple selections
#     others_description = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"{self.place} for {self.journey_preferences.name}"

# # 7 . Then in the next page , the user will enter the Departure Date and Time , Arrival Date and Time ,
# # International Airport , Preferred Flight Class 

# class TravelDetails(models.Model):

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     from_date = models.DateField()
#     to_date = models.DateField()
#     international_airport = models.CharField(max_length=100)
#     flight_class = models.CharField(max_length=50)

#     def __str__(self):
#         return f"Travel Details for {self.journey_preferences.name}"

# # 8 . In the next page the user can select the type of stay like hotel,motel,villa,cottages,appartment and guesthouse

# class StayPreferences(models.Model):#two
#     STAY_TYPE_CHOICES = [
#         ('hotel', 'Hotel'),
#         ('motel', 'Motel'),
#         ('villa', 'Villa'),
#         ('cottage', 'Cottage'),
#         ('apartment', 'Apartment'),
#         ('guesthouse', 'Guesthouse'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     stay_type = models.TextField(max_length=50, choices=STAY_TYPE_CHOICES)

#     def __str__(self):
#         return f"{self.stay_type} for {self.journey_preferences.name}"

# # 9 . Then they can select the foods they need IN Vegetarain There will be North Indian Vegetarian , South Indian Vegetarain ,
# # Gujarati Vegetarain , Jain Vegetarian and IN Non Vegetarain There will be North Indian Non-Vegetarian , South Indian Non-Vegetarain ,
# # IN Other Dietry there will be Vegan , Keto , Halal and IN Balinese Dish Preferences there will be Jimbaran SeaFood , Balinese Culinary,
# # Indonesian Food , Local Snacks , Souvenir Foods and in others we can type if dont find our preferences.	

# #doubt
# class FoodPreferences(models.Model):#two
#     # Vegetarian preferences
#     VEGETARIAN_CHOICES = [
#         ('north_indian', 'North Indian Vegetarian'),
#         ('south_indian', 'South Indian Vegetarian'),
#         ('gujarati', 'Gujarati Vegetarian'),
#         ('jain', 'Jain Vegetarian')
#     ]
    
#     # Non-Vegetarian preferences
#     NON_VEGETARIAN_CHOICES = [
#         ('north_indian', 'North Indian Non-Vegetarian'),
#         ('south_indian', 'South Indian Non-Vegetarian')
#     ]
    
#     # Other dietary preferences
#     DIETARY_CHOICES = [
#         ('vegan', 'Vegan'),
#         ('keto', 'Keto'),
#         ('halal', 'Halal')
#     ]
    
#     # Balinese dish preferences
#     BALINESE_CHOICES = [
#         ('jimbaran_seafood', 'Jimbaran Seafood'),
#         ('balinese_culinary', 'Balinese Culinary'),
#         ('indonesian_food', 'Indonesian Food'),
#         ('local_snacks', 'Local Snacks'),
#         ('souvenir_foods', 'Souvenir Foods')
#     ]
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE,null=True)
#     # Fields to store user selections
#     vegetarian_choice = models.CharField(max_length=50, choices=VEGETARIAN_CHOICES, blank=True, null=True)
#     non_vegetarian_choice = models.CharField(max_length=50, choices=NON_VEGETARIAN_CHOICES, blank=True, null=True)
#     dietary_choice = models.CharField(max_length=50, choices=DIETARY_CHOICES, blank=True, null=True)
#     balinese_choice = models.CharField(max_length=50, choices=BALINESE_CHOICES, blank=True, null=True)
#     other_preferences = models.TextField(blank=True, null=True)  # For additional dietary preferences if 'other' is chosen

#     def __str__(self):
#         preferences = []
#         if self.vegetarian_choice:
#             preferences.append(f"Vegetarian: {self.vegetarian_choice}")
#         if self.non_vegetarian_choice:
#             preferences.append(f"Non-Vegetarian: {self.non_vegetarian_choice}")
#         if self.dietary_choice:
#             preferences.append(f"Dietary: {self.dietary_choice}")
#         if self.balinese_choice:
#             preferences.append(f"Balinese Dish: {self.balinese_choice}")
#         if self.other_preferences:
#             preferences.append(f"Other Preferences: {self.other_preferences}")
        
#         return ', '.join(preferences)


# # 10 . Then in the next page we can select the Type of Vehicle like Motorbike ( 1-2 people ), Bus (>30 people) ,
# # MiniBus (20-30 people) , Van (12-15 people) , Car (5-10 people ) , Luxury Car (5-8 people) and in the same page 
# # we have Rent Period like 1-2 Days , >3 Days and we have others option to type something and we can choose 
# # Include Driver ? Yes , No

# class VehiclePreferences(models.Model): #one
#     VEHICLE_TYPE_CHOICES = [
#         ('motorbike', 'Motorbike (1-2 people)'),
#         ('bus', 'Bus (>30 people)'),
#         ('minibus', 'MiniBus (20-30 people)'),
#         ('van', 'Van (12-15 people)'),
#         ('car', 'Car (5-10 people)'),
#         ('luxury_car', 'Luxury Car (5-8 people)'),
#     ]

#     RENT_PERIOD_CHOICES = [
#         ('1_2_days', '1-2 Days'),
#         ('more_than_3_days', '>3 Days'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     vehicle_type = models.CharField(max_length=50, choices=VEHICLE_TYPE_CHOICES)
#     rent_period = models.CharField(max_length=20, choices=RENT_PERIOD_CHOICES)
#     include_driver = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.vehicle_type} for {self.journey_preferences.name}"

# # 11 . In the next page we have I prefer a Tour Guide Who Speaks like Tamil , Englsih , Hindi , Marathi , 
# # Gujarati and Kannada and in others we can type something 

# class TourGuidePreferences(models.Model): #three
#     LANGUAGES_CHOICES = [
#         ('tamil', 'Tamil'),
#         ('english', 'English'),
#         ('hindi', 'Hindi'),
#         ('marathi', 'Marathi'),
#         ('gujarati', 'Gujarati'),
#         ('kannada', 'Kannada'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     preferred_language = models.CharField(max_length=50, choices=LANGUAGES_CHOICES)
#     other_language = models.CharField(max_length=100, blank=True, null=True)

#     def __str__(self):
#         return f"Tour Guide Preferences for {self.journey_preferences.name}"

# # 12 . In the next page we can select whether we want Personal Chef or Catering .	

# class CateringOrChef(models.Model): #one
#     SERVICE_CHOICES = [
#         ('personal_chef', 'Personal Chef'),
#         ('catering', 'Catering'),
#         ('other', 'Other')
#     ]
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE,null=True)
#     service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
#     description = models.TextField(blank=True, null=True)  # User can describe their specific need if 'Other' is selected

#     def __str__(self):
#         return self.service_type

# # 13 . In the next page we have Paperwork like KYC Integration , Visa Processing Assistance and 
# # Travel Requirement guidance and there is a option for others We can type something there .

# class PaperworkAssistance(models.Model): #multiple
#     ASSISTANCE_CHOICES = [
#         ('kyc_integration', 'KYC Integration'),
#         ('visa_processing', 'Visa Processing Assistance'),
#         ('travel_requirements', 'Travel Requirement Guidance'),
#         ('others', 'Others'),
#     ]

#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     assistance_type = models.CharField(max_length=50, choices=ASSISTANCE_CHOICES)
#     other_assistance_details = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"Paperwork Assistance for {self.journey_preferences.name}"

# # 14 . In the next page we can select like Event Organizer , Vegetable Vendors , Utensil Vendors , Travel Agent 
# # and there will also be others option if we dont find our options here then we can type about it in others.		

# class Vendor(models.Model): #multiple
#     VENDOR_CHOICES = [
#         ('vegetable', 'Vegetable Vendor'),
#         ('utensil', 'Utensil Vendor'),
#         ('travel_agent', 'Travel Agent'),
#         ('event_organizer', 'Event Organizer'),  
#         ('other', 'Other')
#     ]
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE,null=True)
#     vendor_type = models.TextField(max_length=20, choices=VENDOR_CHOICES, default='other')
#     description = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.vendor_type

# # 15 . And at the final , there will be a request box there the user can type any extra information they need   

# class ExtraRequests(models.Model):
#     journey_preferences = models.OneToOneField(JourneyPreferences, on_delete=models.CASCADE)
#     requests = models.TextField()

#     def __str__(self):
#         return f"Extra Requests for {self.journey_preferences.name}"



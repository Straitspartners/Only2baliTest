from rest_framework import serializers
from .models import *

class JourneyPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyPreferences
        fields = '__all__'

    def validate(self, data):
        crew_type = data.get('crew_type')
        crew_type_others = data.get('crew_type_others')

        # Check if 'others' is selected but no custom value is provided
        if crew_type == 'others' and not crew_type_others:
            raise serializers.ValidationError("Please specify a custom crew type in the 'others' field.")
        
        # Validate that the selected crew_type is valid
        if crew_type not in dict(JourneyPreferences.CREW_TYPE_CHOICES).keys() and crew_type != 'others':
            raise serializers.ValidationError("Invalid crew type selected.")
        
        if 'others' not in crew_type:
            if crew_type_others:
                raise serializers.ValidationError("You can type here only when the others is selected as a choice")
        
        return data


class PlacesToVisitSerializer(serializers.ModelSerializer):
    place = serializers.PrimaryKeyRelatedField(queryset=Place.objects.all(), many=True)
    place_names = serializers.SerializerMethodField()

    class Meta:
        model = PlacesToVisit
        fields = '__all__'

    def get_place_names(self, obj):
        return [place.place_name for place in obj.place.all()]

    def validate(self, data):
        places = data.get('place', [])
        others_description = data.get('others_description')

        # Validate that each selected place matches the defined choices
        valid_places = [choice[0] for choice in Place.PLACES_CHOICES]
        for place in places:
            if place.place_name not in valid_places:
                raise serializers.ValidationError(f"Invalid place selected: {place.place_name}")

        if others_description and not any(place.place_name == 'others' for place in places):
            raise serializers.ValidationError("You can only provide an 'others' description when 'others' is selected as a place.")

        if any(place.place_name == 'others' for place in places) and not others_description:
            raise serializers.ValidationError("Please provide a description for 'others'.")

        return data
    
class StayPreferencesSerializer(serializers.ModelSerializer):
    stay_type = serializers.PrimaryKeyRelatedField(queryset=StayType.objects.all(), many=True)
    stay_type_names = serializers.SerializerMethodField()

    class Meta:
        model = StayPreferences
        fields = '__all__'

    def get_stay_type_names(self, obj):
        return [stay.stay_type_name for stay in obj.stay_type.all()]

    def validate(self, data):
        stay_types = data.get('stay_type', [])
        valid_stay_types = [choice[0] for choice in StayType.STAY_TYPE_CHOICES]

        # Ensure no more than two stay types are selected
        if len(stay_types) > 2:
            raise serializers.ValidationError("You can select a maximum of two stay types.")

        # Validate that each selected stay type matches the defined choices
        for stay in stay_types:
            if stay.stay_type_name not in valid_stay_types:
                raise serializers.ValidationError(f"Invalid stay type selected: {stay.stay_type_name}")

        return data

class TravelDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelDetails
        fields = '__all__'


from rest_framework import serializers
from .models import FoodPreferences, VegetarianChoice, NonVegetarianChoice, DietaryChoice, BalineseChoice

class FoodPreferencesSerializer(serializers.ModelSerializer):
    # Primary key relationships
    vegetarian_choice = serializers.PrimaryKeyRelatedField(queryset=VegetarianChoice.objects.all(), many=True)
    non_vegetarian_choice = serializers.PrimaryKeyRelatedField(queryset=NonVegetarianChoice.objects.all(), many=True)
    dietary_choice = serializers.PrimaryKeyRelatedField(queryset=DietaryChoice.objects.all(), many=True)
    balinese_choice = serializers.PrimaryKeyRelatedField(queryset=BalineseChoice.objects.all(), many=True)

    # SerializerMethodField for each category to return the names instead of IDs
    vegetarian_choice_names = serializers.SerializerMethodField()
    non_vegetarian_choice_names = serializers.SerializerMethodField()
    dietary_choice_names = serializers.SerializerMethodField()
    balinese_choice_names = serializers.SerializerMethodField()

    class Meta:
        model = FoodPreferences
        fields = '__all__'

    def get_vegetarian_choice_names(self, obj):
        return [choice.choice_name for choice in obj.vegetarian_choice.all()]

    def get_non_vegetarian_choice_names(self, obj):
        return [choice.choice_name for choice in obj.non_vegetarian_choice.all()]

    def get_dietary_choice_names(self, obj):
        return [choice.choice_name for choice in obj.dietary_choice.all()]

    def get_balinese_choice_names(self, obj):
        return [choice.choice_name for choice in obj.balinese_choice.all()]

    def validate(self, data):
        # Get selected food preferences
        vegetarian_choices = data.get('vegetarian_choice', [])
        non_vegetarian_choices = data.get('non_vegetarian_choice', [])
        dietary_choices = data.get('dietary_choice', [])
        balinese_choices = data.get('balinese_choice', [])

        # Count the total selected choices across all categories
        selected_choices = (
            len(vegetarian_choices) + len(non_vegetarian_choices) + 
            len(dietary_choices) + len(balinese_choices)
        )

        # Validate that no more than four choices are selected
        if selected_choices > 4:
            raise serializers.ValidationError("You can select a maximum of four food preferences.")

        # Validate that each selected choice is valid (i.e., exists in the database)
        valid_vegetarian_choices = VegetarianChoice.objects.all().values_list('choice_name', flat=True)
        valid_non_vegetarian_choices = NonVegetarianChoice.objects.all().values_list('choice_name', flat=True)
        valid_dietary_choices = DietaryChoice.objects.all().values_list('choice_name', flat=True)
        valid_balinese_choices = BalineseChoice.objects.all().values_list('choice_name', flat=True)

        for choice in vegetarian_choices:
            if choice.choice_name not in valid_vegetarian_choices:
                raise serializers.ValidationError(f"Invalid vegetarian choice: {choice.choice_name}")
        
        for choice in non_vegetarian_choices:
            if choice.choice_name not in valid_non_vegetarian_choices:
                raise serializers.ValidationError(f"Invalid non-vegetarian choice: {choice.choice_name}")
        
        for choice in dietary_choices:
            if choice.choice_name not in valid_dietary_choices:
                raise serializers.ValidationError(f"Invalid dietary choice: {choice.choice_name}")
        
        for choice in balinese_choices:
            if choice.choice_name not in valid_balinese_choices:
                raise serializers.ValidationError(f"Invalid Balinese choice: {choice.choice_name}")

        return data


class VehiclePreferencesSerializer(serializers.ModelSerializer):
    vehicle = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all(), many=True)
    vehicle_names = serializers.SerializerMethodField()

    class Meta:
        model = VehiclePreferences
        fields = '__all__'

    def get_vehicle_names(self, obj):   
        return [vehicle.vehicle_type_name for vehicle in obj.vehicle.all()]

    def validate(self, data):
        vehicles = data.get('vehicle', [])
        other_preferences = data.get('other_preferences')
        rent_period = data.get('rent_period')

        # Validate that each selected vehicle matches the defined choices
        valid_vehicle_types = [choice[0] for choice in VehicleType.VEHICLE_TYPE_CHOICES]
        for vehicle in vehicles:
            if vehicle.vehicle_type_name not in valid_vehicle_types:
                raise serializers.ValidationError(f"Invalid vehicle selected: {vehicle.vehicle_type_name}")

        # Validate that rent_period is valid
        if rent_period not in dict(VehiclePreferences.RENT_PERIOD_CHOICES).keys():
            raise serializers.ValidationError("Invalid rent period selected.")

        # Optionally, validate 'other_preferences' if necessary
        if other_preferences and not any(vehicle.vehicle_type_name == 'others' for vehicle in vehicles):
            raise serializers.ValidationError("You can only provide 'other_preferences' when 'others' is selected as a vehicle.")

        if any(vehicle.vehicle_type_name == 'others' for vehicle in vehicles) and not other_preferences:
            raise serializers.ValidationError("Please provide a description for 'others' in the 'other_preferences' field.")

        return data


class TourGuidePreferencesSerializer(serializers.ModelSerializer):
    # Allow selecting a list of languages using PrimaryKeyRelatedField
    preferred_languages = serializers.PrimaryKeyRelatedField(queryset=Language.objects.all(), many=True)
    preferred_languages_names = serializers.SerializerMethodField()

    class Meta:
        model = TourGuidePreferences
        fields = '__all__'

    def get_preferred_languages_names(self, obj):
        return [language.language_name for language in obj.preferred_languages.all()]


    def validate(self, data):
        preferred_languages = data.get('preferred_languages', [])
        other_language = data.get('other_language')

        # Ensure the user selects a maximum of three languages
        if len(preferred_languages) > 3:
            raise serializers.ValidationError("You can select a maximum of three languages.")

        # Validate that each selected language matches the defined choices
        valid_languages = [choice[0] for choice in Language.LANGUAGES_CHOICES]
        for language in preferred_languages:
            if language.language_name not in valid_languages and language.language_name != 'others':
                raise serializers.ValidationError(f"Invalid language selected: {language.language_name}")

        # Ensure that 'other_language' is provided when 'others' is selected
        if any(language.language_name == 'others' for language in preferred_languages) and not other_language:
            raise serializers.ValidationError("Please specify a custom language in the 'other_language' field.")

        # if other_language and not any(language.language_name == 'others' for language in preferred_languages):
        #     raise serializers.ValidationError("You can only provide 'other_language' when 'others' is selected as a language.")

        return data



class CateringOrChefSerializer(serializers.ModelSerializer):
    class Meta:
        model = CateringOrChef
        fields = '__all__'

    def validate(self, data):
        service_type=data.get('service_type')
        description=data.get('description')

        if service_type == 'others' and not description:
            raise serializers.ValidationError("Please specify a custom service type in the 'others' field.")

        if service_type not in dict(CateringOrChef.SERVICE_CHOICES).keys() and service_type!='others':
            raise serializers.ValidationError("Invalid service type selected.")
        
        if 'others' not in service_type:
            if description:
                raise serializers.ValidationError("You can type here only when the others is selected as a choice")

        return data


class PaperworkAssistanceSerializer(serializers.ModelSerializer):
    # Allow selecting multiple assistance types using PrimaryKeyRelatedField
    assistance_type = serializers.PrimaryKeyRelatedField(queryset=AssistanceType.objects.all(), many=True)
    assistance_type_names = serializers.SerializerMethodField()

    class Meta:
        model = PaperworkAssistance
        fields = '__all__'

    def get_assistance_type_names(self, obj):
        return [assistance.name for assistance in obj.assistance_type.all()]

    def validate(self, data):
        assistance_types = data.get('assistance_type', [])
        other_assistance_details = data.get('other_assistance_details')

        # Ensure the user selects no more than 3 assistance types
        if len(assistance_types) > 3:
            raise serializers.ValidationError("You can select a maximum of three assistance types.")

        # Validate that each selected assistance type is a valid choice
        valid_assistances = [choice[0] for choice in AssistanceType.ASSISTANCE_CHOICES]
        for assistance in assistance_types:
            if assistance.name not in valid_assistances and assistance.name != 'others':
                raise serializers.ValidationError(f"Invalid assistance type selected: {assistance.name}")

        # Ensure that 'other_assistance_details' is provided when 'others' is selected
        if any(assistance.name == 'others' for assistance in assistance_types) and not other_assistance_details:
            raise serializers.ValidationError("Please provide a description for 'others' in the 'other_assistance_details' field.")

        # Ensure that 'other_assistance_details' is not provided unless 'others' is selected
        if other_assistance_details and not any(assistance.name == 'others' for assistance in assistance_types):
            raise serializers.ValidationError("You can only provide 'other_assistance_details' when 'others' is selected as an assistance type.")

        return data



class VendorSerializer(serializers.ModelSerializer):
    # Allow selecting multiple vendor types using PrimaryKeyRelatedField
    vendor_type = serializers.PrimaryKeyRelatedField(queryset=VendorType.objects.all(), many=True)
    vendor_type_names = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = '__all__'

    def get_vendor_type_names(self, obj):
        return [vendor.name for vendor in obj.vendor_type.all()]
    
    def validate(self, data):
        vendor_types = data.get('vendor_type', [])
        description = data.get('description')

        # Ensure the user selects no more than 3 vendor types
        if len(vendor_types) > 3:
            raise serializers.ValidationError("You can select a maximum of three vendor types.")

        # Validate that each selected vendor type is valid
        valid_vendor_types = VendorType.objects.values_list('name', flat=True)
        for vendor in vendor_types:
            if vendor.name not in valid_vendor_types and vendor.name != 'others':
                raise serializers.ValidationError(f"Invalid vendor type selected: {vendor.name}")

        # Ensure that 'description' is provided when 'others' is selected
        if any(vendor.name == 'others' for vendor in vendor_types) and not description:
            raise serializers.ValidationError("Please provide a description for 'others' in the 'description' field.")

        # Ensure that 'description' is not provided unless 'others' is selected
        if description and not any(vendor.name == 'others' for vendor in vendor_types):
            raise serializers.ValidationError("You can only provide a description when 'others' is selected as a vendor type.")

        return data



class ExtraRequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraRequests
        fields = '__all__'

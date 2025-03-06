from .models import *
from .serializers import *
from django.db.models.functions import Coalesce
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging
from datetime import datetime
from datetime import date
from rest_framework.decorators import api_view, permission_classes

logger = logging.getLogger(__name__)

class JourneyPreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        journey_preferences_id = request.query_params.get("journey_preferences_id")

        if not journey_preferences_id:
            return Response({"error": "journey_preferences_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            preferences = JourneyPreferences.objects.get(id=journey_preferences_id, user=user)
            serializer = JourneyPreferencesSerializer(preferences)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except JourneyPreferences.DoesNotExist:
            return Response({"error": "Journey Preferences not found."}, status=status.HTTP_404_NOT_FOUND)

    # def get(self, request):
    #     user = request.user
    #     preferences = JourneyPreferences.objects.filter(user=user)
    #     serializer = JourneyPreferencesSerializer(preferences, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        data['user'] = request.user.id
        serializer = JourneyPreferencesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        journey_preferences_id = request.data.get("journey_preferences_id")

        if not journey_preferences_id:
            return Response({"error": "journey_preferences_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            preferences = JourneyPreferences.objects.get(id=journey_preferences_id, user=user)
        except JourneyPreferences.DoesNotExist:
            return Response({"error": "Journey Preferences not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = JourneyPreferencesSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BasePreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    model = None
    serializer_class = None

    def get(self, request):
        user = request.user
        journey_preferences_id = request.query_params.get("journey_preferences_id")

        if not journey_preferences_id:
            return Response({"error": "journey_preferences_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            preference = self.model.objects.get(journey_preferences__user=user, journey_preferences__id=journey_preferences_id)
            serializer = self.serializer_class(preference)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except self.model.DoesNotExist:
            return Response({"error": f"{self.model.__name__} not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        user = request.user
        journey_preferences_id = request.data.get("journey_preferences_id")

        if not journey_preferences_id:
            return Response({"error": "journey_preferences_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            journey_preferences = JourneyPreferences.objects.get(id=journey_preferences_id, user=user)
        except JourneyPreferences.DoesNotExist:
            return Response({"error": "Journey Preferences not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data["journey_preferences"] = journey_preferences.id  # Ensuring the relationship is correct

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(journey_preferences=journey_preferences)  # Ensuring the object is saved properly
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def put(self, request):
        user = request.user
        journey_preferences_id = request.data.get("journey_preferences_id")

        if not journey_preferences_id:
            return Response({"error": "journey_preferences_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Find the matching record by journey_preferences_id
        try:
            preference = self.model.objects.get(journey_preferences__user=user, journey_preferences__id=journey_preferences_id)
        except self.model.DoesNotExist:
            return Response({"error": f"{self.model.__name__} with journey_preferences_id {journey_preferences_id} not found for this user."},
                        status=status.HTTP_404_NOT_FOUND)

    # Now update that particular record
        serializer = self.serializer_class(preference, data=request.data, partial=True)
    
        if serializer.is_valid():
        # Save the updated object
            updated_preference = serializer.save()

        # Serialize the updated object to include it in the response
            updated_serializer = self.serializer_class(updated_preference)

        # Return the full updated data
            return Response({
            "message": f"Updated {self.model.__name__} successfully.",
            "updated_data": updated_serializer.data
        }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlacesToVisitView(BasePreferenceView):
    model = PlacesToVisit
    serializer_class = PlacesToVisitSerializer


class StayPreferencesView(BasePreferenceView):
    model = StayPreferences
    serializer_class = StayPreferencesSerializer


class TravelDetailsView(BasePreferenceView):
    model = TravelDetails
    serializer_class = TravelDetailsSerializer


class FoodPreferencesView(BasePreferenceView):
    model = FoodPreferences
    serializer_class = FoodPreferencesSerializer


class VehiclePreferencesView(BasePreferenceView):
    model = VehiclePreferences
    serializer_class = VehiclePreferencesSerializer


class TourGuidePreferencesView(BasePreferenceView):
    model = TourGuidePreferences
    serializer_class = TourGuidePreferencesSerializer


class CateringOrChefView(BasePreferenceView):
    model = CateringOrChef
    serializer_class = CateringOrChefSerializer


class PaperworkAssistanceView(BasePreferenceView):
    model = PaperworkAssistance
    serializer_class = PaperworkAssistanceSerializer

class VendorView(BasePreferenceView):
    model = Vendor
    serializer_class = VendorSerializer

class ExtraRequestsView(BasePreferenceView):
    model = ExtraRequests
    serializer_class = ExtraRequestsSerializer


class SelectPreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.debug(f"Request Headers: {request.headers}")
        user = request.user
        
        # Get all preferences related to the user
        try:
            journey_preferences = JourneyPreferences.objects.filter(user=user).order_by('-id').first()
        except JourneyPreferences.DoesNotExist:
            return Response({"error": "Journey Preferences not found."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve each set of preferences
        placestovisit_preferences = PlacesToVisit.objects.filter(journey_preferences=journey_preferences)
        traveldetails_preferences = TravelDetails.objects.filter(journey_preferences=journey_preferences)
        stay_preferences = StayPreferences.objects.filter(journey_preferences=journey_preferences)
        food_preferences = FoodPreferences.objects.filter(journey_preferences=journey_preferences)
        vehicle_preferences = VehiclePreferences.objects.filter(journey_preferences=journey_preferences)
        tour_guide_preferences = TourGuidePreferences.objects.filter(journey_preferences=journey_preferences)
        catering_chef_preferences = CateringOrChef.objects.filter(journey_preferences=journey_preferences)
        papaerwork_assistance = PaperworkAssistance.objects.filter(journey_preferences=journey_preferences)
        vendor = Vendor.objects.filter(journey_preferences=journey_preferences)
        extra_requests = ExtraRequests.objects.filter(journey_preferences=journey_preferences)
        
        # Serialize each preference type
        placestovisit_serializer = PlacesToVisitSerializer(placestovisit_preferences, many=True)
        traveldetails_serializer = TravelDetailsSerializer(traveldetails_preferences, many=True)
        stay_serializer = StayPreferencesSerializer(stay_preferences, many=True)
        food_serializer = FoodPreferencesSerializer(food_preferences, many=True)
        vehicle_serializer = VehiclePreferencesSerializer(vehicle_preferences, many=True)
        tour_guide_serializer = TourGuidePreferencesSerializer(tour_guide_preferences, many=True)
        catering_serializer = CateringOrChefSerializer(catering_chef_preferences, many=True)
        paperwork_serializer = PaperworkAssistanceSerializer(papaerwork_assistance, many=True)
        vendor_serializer = VendorSerializer(vendor, many=True)
        extra_serializer = ExtraRequestsSerializer(extra_requests, many=True)

        # Combine all preferences in a single response
        preferences_data = {
            "journey_preferences": JourneyPreferencesSerializer(journey_preferences).data,
            "placestovisit_preferences": placestovisit_serializer.data,
            "traveldetails_preferences": traveldetails_serializer.data,
            "stay_preferences": stay_serializer.data,
            "food_preferences": food_serializer.data,
            "vehicle_preferences": vehicle_serializer.data,
            "tour_guide_preferences": tour_guide_serializer.data,
            "catering_chef_preferences": catering_serializer.data,
            "paperwork_assistance": paperwork_serializer.data,
            "vendor": vendor_serializer.data,
            "extra_requests": extra_serializer.data, 
        }

        return Response(preferences_data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user

        # Fetch all preference models
        try:
            journey_preferences = JourneyPreferences.objects.get(user=user)
            placestovisit_preferences = PlacesToVisit.objects.get(journey_preferences=journey_preferences)
            traveldetails_preferences = TravelDetails.objects.get(journey_preferences=journey_preferences)
            stay_preferences = StayPreferences.objects.get(journey_preferences=journey_preferences)
            food_preferences = FoodPreferences.objects.get(journey_preferences=journey_preferences)
            vehicle_preferences = VehiclePreferences.objects.get(journey_preferences=journey_preferences)
            tour_guide_preferences = TourGuidePreferences.objects.get(journey_preferences=journey_preferences)
            catering_preferences = CateringOrChef.objects.get(journey_preferences=journey_preferences)
            paperwork_preferences = PaperworkAssistance.objects.get(journey_preferences=journey_preferences)
            vendor_preferences = Vendor.objects.get(journey_preferences=journey_preferences)
            extra_requests = ExtraRequests.objects.get(journey_preferences=journey_preferences)
        except (JourneyPreferences.DoesNotExist,PlacesToVisit.DoesNotExist,TravelDetails.DoesNotExist ,StayPreferences.DoesNotExist, FoodPreferences.DoesNotExist,
                VehiclePreferences.DoesNotExist, TourGuidePreferences.DoesNotExist, CateringOrChef.DoesNotExist, PaperworkAssistance.DoesNotExist, Vendor.DoesNotExist,
                Vendor.DoesNotExist,ExtraRequests.DoesNotExist):
            return Response({"error": "Preferences not found."}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize incoming data to update preferences
        journey_serializer = JourneyPreferencesSerializer(journey_preferences, data=request.data.get('journey_preferences'), partial=True)
        placestovisit_serializer = PlacesToVisitSerializer(placestovisit_preferences, data=request.data.get('placestovisit_preferences'), partial=True)
        traveldetails_serializer = TravelDetailsSerializer(traveldetails_preferences, data=request.data.get('traveldetails_preferences'), partial=True)
        stay_serializer = StayPreferencesSerializer(stay_preferences, data=request.data.get('stay_preferences'), partial=True)
        food_serializer = FoodPreferencesSerializer(food_preferences, data=request.data.get('food_preferences'), partial=True)
        vehicle_serializer = VehiclePreferencesSerializer(vehicle_preferences, data=request.data.get('vehicle_preferences'), partial=True)
        tour_guide_serializer = TourGuidePreferencesSerializer(tour_guide_preferences, data=request.data.get('tour_guide_preferences'), partial=True)
        catering_serializer = CateringOrChefSerializer(catering_preferences, data=request.data.get('catering_chef_preferences'), partial=True)
        paperwork_serializer = PaperworkAssistanceSerializer(paperwork_preferences, data=request.data.get('paperwork_assistance'), partial=True)
        vendor_serializer = VendorSerializer(vendor_preferences, data=request.data.get('vendor'), partial=True)
        extra_serializer = ExtraRequestsSerializer(extra_requests, data=request.data.get('extra_requests'), partial=True)

        # Check if each serializer is valid and save
        if all([
            journey_serializer.is_valid(),
            placestovisit_serializer.is_valid(),
            traveldetails_serializer.is_valid(),
            stay_serializer.is_valid(),
            food_serializer.is_valid(),
            vehicle_serializer.is_valid(),
            tour_guide_serializer.is_valid(),
            catering_serializer.is_valid(),
            paperwork_serializer.is_valid(),
            vendor_serializer.is_valid(),
            extra_serializer.is_valid(),
        ]):
            journey_serializer.save()
            placestovisit_serializer.save()
            traveldetails_serializer.save()
            stay_serializer.save()
            food_serializer.save()
            vehicle_serializer.save()
            tour_guide_serializer.save()
            catering_serializer.save()
            paperwork_serializer.save()
            vendor_serializer.save()
            extra_serializer.save()
            return Response({"message": "Preferences updated successfully."}, status=status.HTTP_200_OK)
        
        # If any serializer is invalid, return error
        return Response({
            "error": "Invalid data provided for preferences.",
            "details": {
                "journey_preferences": journey_serializer.errors,
                "placestovisit_preferences": placestovisit_serializer.errors,
                "traveldetails_preferences": traveldetails_serializer.errors,
                "stay_preferences": stay_serializer.errors,
                "food_preferences": food_serializer.errors,
                "vehicle_preferences": vehicle_serializer.errors,
                "tour_guide_preferences": tour_guide_serializer.errors,
                "catering_chef_preferences": catering_serializer.errors,
                "paperwork_assistance": paperwork_serializer.errors,
                "vendor": vendor_serializer.errors,
                "extra_requests": extra_serializer.errors,
            }
        }, status=status.HTTP_400_BAD_REQUEST)

class ItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        international_airport = request.query_params.get("international_airport")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        crew_type = request.query_params.get("crew_type_display")

        if not from_date or not to_date:
            return Response({"error": "from_date and to_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            international_airport = international_airport
            crew_type = crew_type
                                                                                                                                    
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the selected itinerary
        itinerary = JourneyPreferences.objects.filter(
            user=request.user,
            traveldetails__from_date=from_date,
            traveldetails__to_date=to_date,
            traveldetails__international_airport=international_airport,
            crew_type=crew_type
        ).first()

        if not itinerary:
            return Response({"error": "Itinerary not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize main journey preference
        itinerary_serializer = JourneyPreferencesSerializer(itinerary)

        # TravelDetails Serializer
        class TravelDetailsSerializer(serializers.ModelSerializer):
            class Meta:
                model = TravelDetails
                fields = '__all__'

        # Fetch related preferences
        travel_details = TravelDetails.objects.filter(journey_preferences=itinerary)
        travel_details_serializer = TravelDetailsSerializer(travel_details, many=True)

        places_to_visit = PlacesToVisit.objects.filter(journey_preferences=itinerary)
        places_to_visit_serializer = PlacesToVisitSerializer(places_to_visit, many=True)

        stay_preferences = StayPreferences.objects.filter(journey_preferences=itinerary)
        stay_preferences_serializer = StayPreferencesSerializer(stay_preferences, many=True)

        food_preferences = FoodPreferences.objects.filter(journey_preferences=itinerary)
        food_preferences_serializer = FoodPreferencesSerializer(food_preferences, many=True)

        vehicle_preferences = VehiclePreferences.objects.filter(journey_preferences=itinerary)
        vehicle_preferences_serializer = VehiclePreferencesSerializer(vehicle_preferences, many=True)

        tour_guide_preferences = TourGuidePreferences.objects.filter(journey_preferences=itinerary)
        tour_guide_preferences_serializer = TourGuidePreferencesSerializer(tour_guide_preferences, many=True)

        catering_or_chef = CateringOrChef.objects.filter(journey_preferences=itinerary)
        catering_or_chef_serializer = CateringOrChefSerializer(catering_or_chef, many=True)

        paperwork_assistance = PaperworkAssistance.objects.filter(journey_preferences=itinerary)
        paperwork_assistance_serializer = PaperworkAssistanceSerializer(paperwork_assistance, many=True)

        vendor = Vendor.objects.filter(journey_preferences=itinerary)
        vendor_serializer = VendorSerializer(vendor, many=True)

        extra_requests = ExtraRequests.objects.filter(journey_preferences=itinerary)
        extra_requests_serializer = ExtraRequestsSerializer(extra_requests, many=True)

        return Response({
            "itinerary": itinerary_serializer.data,
            "travel_details": travel_details_serializer.data,
            "places_to_visit": places_to_visit_serializer.data,
            "stay_preferences": stay_preferences_serializer.data,
            "food_preferences": food_preferences_serializer.data,
            "vehicle_preferences": vehicle_preferences_serializer.data,
            "tour_guide_preferences": tour_guide_preferences_serializer.data,
            "catering_or_chef": catering_or_chef_serializer.data,
            "paperwork_assistance": paperwork_assistance_serializer.data,
            "vendor": vendor_serializer.data,
            "extra_requests": extra_requests_serializer.data
        }, status=status.HTTP_200_OK)


class ItineraryDatesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        current_date = date.today()

        # Query past, present, and future itineraries and select the required fields
        past_itineraries = JourneyPreferences.objects.filter(
            user=request.user,
            traveldetails__to_date__lt=current_date,
            confirmed=True
        ).select_related('traveldetails').annotate(
            crew_type_display=Coalesce('crew_type', 'crew_type_others')  # Use crew_type_others if crew_type is null
        ).values(
            'traveldetails__from_date', 
            'traveldetails__to_date',
            'traveldetails__international_airport',  # Access international airport from TravelDetails
            'crew_type_display'  # Use the annotated crew_type_display
        )

        present_itineraries = JourneyPreferences.objects.filter(
            user=request.user,
            traveldetails__from_date__lte=current_date,
            traveldetails__to_date__gte=current_date,
            confirmed=True
        ).select_related('traveldetails').annotate(
            crew_type_display=Coalesce('crew_type', 'crew_type_others')  # Use crew_type_others if crew_type is null
        ).values(
            'traveldetails__from_date', 
            'traveldetails__to_date',
            'traveldetails__international_airport',
            'crew_type_display'  # Use the annotated crew_type_display
        )

        future_itineraries = JourneyPreferences.objects.filter(
            user=request.user,
            traveldetails__from_date__gt=current_date,
            confirmed=True
        ).select_related('traveldetails').annotate(
            crew_type_display=Coalesce('crew_type', 'crew_type_others')  # Use crew_type_others if crew_type is null
        ).values(
            'traveldetails__from_date', 
            'traveldetails__to_date',
            'traveldetails__international_airport',
            'crew_type_display'  # Use the annotated crew_type_display
        )

        # Return the dates and other relevant fields for each category
        return Response({
            "past_itineraries": list(past_itineraries),
            "present_itineraries": list(present_itineraries),
            "future_itineraries": list(future_itineraries),
        }, status=status.HTTP_200_OK)
    

class DeleteJourneyPreferences(APIView):
    def delete(self, request, journey_preferences_id):
        try:
            # Find the JourneyPreferences object based on the journey_preferences_id
            journey_preference = JourneyPreferences.objects.get(id=journey_preferences_id)
            journey_preference.delete()

            return Response({"message": "Journey Preferences and related data deleted successfully"}, status=status.HTTP_200_OK)

        except JourneyPreferences.DoesNotExist:
            # If the provided JourneyPreferences ID doesn't exist
            return Response({"message": "Journey Preferences not found"}, status=status.HTTP_404_NOT_FOUND)




# @api_view(["PATCH"])
# @permission_classes([IsAuthenticated])
# def confirm_journey(request, journey_id):
#     try:
#         journey = JourneyPreferences.objects.get(id=journey_id, user=request.user)
#         journey.confirmed = True
#         journey.save()
#         return Response({"message": "Journey confirmed successfully!"}, status=status.HTTP_200_OK)
#     except JourneyPreferences.DoesNotExist:
#         return Response({"error": "Journey not found"}, status=status.HTTP_404_NOT_FOUND)
    

from .models import JourneyPreferences  # Import the model where JourneyPreferences is defined
from django.core.mail import send_mail, EmailMessage  # Import send_mail and EmailMessage
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO


# Function to generate PDF
def generate_pdf(journey):
    # Create a BytesIO buffer to store the PDF data
    buffer = BytesIO()

    # Create a canvas to draw on the PDF
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Define some initial content for the PDF
    # c.drawString(100, 750, f"Journey Confirmation - {journey.id}")
    c.drawString(100, 730, f"User: {journey.user.name}")
    c.drawString(100, 710, f"Departure: {journey.age}")
    c.drawString(100, 690, f"Arrival: {journey.place}")
    c.drawString(100, 670, f"Departure Date: {journey.stay_type}")
    c.drawString(100, 650, f"Arrival Date: {journey.arrival_date}")
    # c.drawString(100, 630, f"Mode of Transport: {journey.mode_of_transport}")
    # c.drawString(100, 610, f"Notes: {journey.notes if journey.notes else 'No additional notes'}")

    # Finalize the PDF document
    c.showPage()
    c.save()

    # Move buffer to the beginning so it can be used by email
    buffer.seek(0)
    return buffer


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def confirm_journey(request, journey_id):
    try:
        # Retrieve the journey preference for the user
        journey = JourneyPreferences.objects.get(id=journey_id, user=request.user)
        
        # Set the journey as confirmed
        journey.confirmed = True
        journey.save()

        # Generate the PDF for the journey details
        pdf_buffer = generate_pdf(journey)

        # Prepare the email subject and body
        subject = "Journey Confirmation"
        body = f"Hello {request.user.first_name},\n\nYour journey has been successfully confirmed. Please find the journey details attached."

        # Create the email message
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email="admin@only2bali.com",  # Replace with your email
            to=[request.user.email],
        )

        # Attach the PDF file
        email.attach(f"journey_{journey.id}_confirmation.pdf", pdf_buffer.read(), 'application/pdf')

        # Send the email using send_mail (via EmailMessage)
        email.send()

        # Return success response
        return Response({"message": "Journey confirmed successfully and confirmation PDF sent!"}, status=status.HTTP_200_OK)

    except JourneyPreferences.DoesNotExist:
        return Response({"error": "Journey not found"}, status=status.HTTP_404_NOT_FOUND)

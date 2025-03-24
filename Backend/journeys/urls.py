from django.urls import path
from .views import *

urlpatterns = [
    
    path('journey-preferences/', JourneyPreferencesView.as_view(), name='journey-preferences'),
    path('travel-details/', TravelDetailsView.as_view(), name='travel-details'),
    path('places-to-visit/', PlacesToVisitView.as_view(), name='places-to-visit'),
    path('stay-preferences/', StayPreferencesView.as_view(), name='stay-preferences'),
    path('food-preferences/', FoodPreferencesView.as_view(), name='food-preferences'),
    path('vehicle-preferences/', VehiclePreferencesView.as_view(), name='vehicle-preferences'),
    path('tour-guide-preferences/', TourGuidePreferencesView.as_view(), name='tour-guide-preferences'),
    path('catering-or-chef/', CateringOrChefView.as_view(), name='catering-or-chef'),
    path('paperwork-assistance/', PaperworkAssistanceView.as_view(), name='paperwork-assistance'),
    path('vendor/', VendorView.as_view(), name='vendor'),
    path('extra-requests/', ExtraRequestsView.as_view(), name='extra-requests'),
    path('select_preferences/', SelectPreferencesView.as_view(), name='select_preferences'),
    path('itinerary/', ItineraryView.as_view(), name='itinerary-list'),
    path('itinerarydate/', ItineraryDatesView.as_view(), name='itinerary-detail'),
    path('journey_preferences/delete/<str:journey_preferences_id>/', DeleteJourneyPreferences.as_view(), name='delete-journey-preferences'),
    path("confirm/<int:journey_id>/", confirm_journey, name="confirm_journey"),
    path('faq/', SendToZohoAPIView.as_view(), name='send_to_zoho'),
    # path('airports/', AirportListView.as_view(), name='airport-list'),
    
]


# # urls.py

# from django.urls import path
# from rest_framework_simplejwt import views as jwt_views

# urlpatterns = [
#     # Obtain new access token using refresh token
#     path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     # Refresh access token using refresh token
#     path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
# ]

# # views.py

# from rest_framework import permissions
# from rest_framework.views import APIView
# from rest_framework.response import Response

# class ProtectedView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         return Response({"message": "This is a protected view!"})

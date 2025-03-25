from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model,authenticate, login
from django.core.cache import cache
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.utils import timezone
from .serializers import *
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.cache import cache
from .models import CustomUser
from django.utils.crypto import get_random_string


CustomUser  = get_user_model()

# Rate limit parameters (example: 5 requests in 5 minutes)
OTP_RATE_LIMIT = {
    'MAX_REQUESTS': 5,
    'TIME_WINDOW': timedelta(minutes=2)
}

# class RegistrationView(APIView):
#     """Handles user registration and OTP generation and verification."""
    
#     def post(self, request):
#         registration_serializer = RegistrationSerializer(data=request.data)
        
#         if registration_serializer.is_valid():
#             data = registration_serializer.validated_data
#             mobile_number = data['mobile_number']
            
#             # Check if the user exceeded OTP rate limits
#             rate_limit_key = f"otp_rate_limit_{mobile_number}"
#             requests_made = cache.get(rate_limit_key, 0)
#             if requests_made >= OTP_RATE_LIMIT['MAX_REQUESTS']:
#                 reset_time = cache.get(f"otp_rate_limit_reset_time_{mobile_number}")
#                 if reset_time:
#                     remaining_time = reset_time - timezone.now()
#                     return Response({"rate_limit": f"Too many OTP requests. Try again after {remaining_time}."}, status=status.HTTP_400_BAD_REQUEST)

#             # Generate OTP and store it in cache
#             otp = get_random_string(length=4, allowed_chars='0123456789')
#             cache_key = f"otp_{mobile_number}"
#             cache.set(cache_key, {"otp": otp, "user_data": data}, timeout=300)  # Store OTP for 5 minutes
            
#             # Send OTP via SMS
#             message = f"Your OTP for registration is: {otp}"
#             send_sms(mobile_number, message)

#             # Increment OTP request count and set reset time
#             cache.set(rate_limit_key, requests_made + 1, timeout=OTP_RATE_LIMIT['TIME_WINDOW'].seconds)
#             cache.set(f"otp_rate_limit_reset_time_{mobile_number}", timezone.now() + OTP_RATE_LIMIT['TIME_WINDOW'], timeout=OTP_RATE_LIMIT['TIME_WINDOW'].seconds)

#             return Response({"message": "OTP sent successfully to your mobile number."}, status=status.HTTP_200_OK)

#         return Response(registration_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationView(APIView):
    """Handles user registration and OTP generation and verification."""
    
    def post(self, request):
        registration_serializer = RegistrationSerializer(data=request.data)
        
        if registration_serializer.is_valid():
            data = registration_serializer.validated_data
            mobile_number = data['mobile_number']
            
            # Check if the user exceeded OTP rate limits
            rate_limit_key = f"otp_rate_limit_{mobile_number}"
            requests_made = cache.get(rate_limit_key, 0)
            if requests_made >= OTP_RATE_LIMIT['MAX_REQUESTS']:
                reset_time = cache.get(f"otp_rate_limit_reset_time_{mobile_number}")
                if reset_time:
                    remaining_time = reset_time - timezone.now()
                    return Response({"rate_limit": f"Too many OTP requests. Try again after {remaining_time}."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate OTP and store it in cache
            otp = get_random_string(length=4, allowed_chars='0123456789')
            cache_key = f"otp_{mobile_number}"
            cache.set(cache_key, {"otp": otp, "user_data": data}, timeout=300)  # Store OTP for 5 minutes
            
            # Send OTP via SMS
            if send_sms(mobile_number, otp, "signup"):
                # Increment OTP request count and set reset time
                cache.set(rate_limit_key, requests_made + 1, timeout=OTP_RATE_LIMIT['TIME_WINDOW'].seconds)
                cache.set(f"otp_rate_limit_reset_time_{mobile_number}", timezone.now() + OTP_RATE_LIMIT['TIME_WINDOW'], timeout=OTP_RATE_LIMIT['TIME_WINDOW'].seconds)

                return Response({"message": "OTP sent successfully to your mobile number."}, status=status.HTTP_200_OK)

            return Response({"error": "Failed to send OTP. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(registration_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    """Handles OTP verification and user creation."""
    def post(self, request,mobile_number):
        otp_serializer = OTPVerificationSerializer(data=request.data, context={'view': self})

        if otp_serializer.is_valid():
          #  mobile_number = otp_serializer.validated_data.get('mobile_number')
            otp = otp_serializer.validated_data.get('otp')

            # Retrieve OTP data from cache
            cache_key = f"otp_{mobile_number}"
            cached_data = cache.get(cache_key)

            if not cached_data:
                return Response({"error": "OTP has expired or is invalid."}, status=status.HTTP_400_BAD_REQUEST)

            # Verify OTP
            if cached_data['otp'] != otp:
                return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the user after OTP verification
            user_data = cached_data['user_data']
            user = CustomUser .objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],  # Make sure password is hashed
                mobile_number=user_data['mobile_number']
            )

            return Response({"message": "User  registered successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response(otp_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    """Handle password reset request by sending a reset email with a token."""

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = CustomUser.objects.filter(email=email).first()

            if user:
                # Generate token for password reset
                token = default_token_generator.make_token(user)
                
                # Generate UID (User ID) encoded in base64
                uid = urlsafe_base64_encode(str(user.pk).encode())
                

                react_ip="192.168.31.111"
                reset_url = f"http://{react_ip}:3000/reset-password/{uid}/{token}/" 
                # reset_url = f"{settings.react_ip}/reset-password/{uid}/{token}/"
                
                # Send the reset email
                subject = "Password Reset Request"
                message = f"Hello {user.username},\n\nYou can reset your password using the following link: {reset_url}\n\nIf you did not request this, please ignore this email."
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

            return Response({"message": "If the email is registered, a password reset link will be sent."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PasswordResetVerifyView(APIView):
    """Handle password reset using the token in the reset URL."""

    def post(self, request):
        serializer = PasswordResetVerifySerializer(data=request.data)
        
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                # Decode the user ID
                user_id = urlsafe_base64_decode(uid).decode()
                user = CustomUser.objects.get(id=user_id)
                
                # Validate the token
                if not default_token_generator.check_token(user, token):
                    return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

                # Set new password
                user.set_password(new_password)
                user.save()

                return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)

            except CustomUser.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    """Retrieve the profile details of the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the authenticated user
        serializer = UserProfileSerializer(user)  # Serialize the user data
        return Response(serializer.data)  # Send the serialized data as response
    
class UserProfileUpdateView(APIView):
    """Allow users to update their profile."""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        # Validate uniqueness of email and mobile number
        if 'email' in data and CustomUser.objects.filter(email=data['email']).exclude(id=user.id).exists():
            return Response({"error": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)
        if 'mobile_number' in data and CustomUser.objects.filter(mobile_number=data['mobile_number']).exclude(id=user.id).exists():
            return Response({"error": "Mobile number is already in use."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user details
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.mobile_number = data.get('mobile_number', user.mobile_number)
        user.dob = data.get('dob', user.dob)
        user.gender=data.get('gender',user.gender)
        user.save()

        return Response({"message": "Profile updated successfully."}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Handles logout by blacklisting the refresh token (for JWT authentication).
    """
    def post(self, request):
        try:
            # Get the refresh token from the request data (sent in the request body)
            refresh_token = request.data.get('refresh', None)

            if refresh_token:
                # Blacklist the refresh token to prevent further use
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# class LoginView(APIView):
#     """
#     Handles login via password or OTP.
#     Returns JWT tokens upon successful authentication.
#     """
#     def post(self, request):
#         login_type = request.data.get('login_type', 'password')  # Default to password login
#         identifier = request.data.get('identifier')  # Email or mobile number
#         password = request.data.get('password', None)
#         otp = request.data.get('otp', None)

#         if login_type == 'password':
#             # Authenticate using email or mobile number and password
#             user = CustomUser.objects.filter(email=identifier).first() or CustomUser.objects.filter(mobile_number=identifier).first()
#             if user:
#                 user = authenticate(username=user.username, password=password)
#                 if user:
#                     tokens = get_tokens_for_user(user)
#                     return Response({"message": "Logged in successfully.", "tokens": tokens}, status=status.HTTP_200_OK)
#             return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

#         elif login_type == 'otp':
#             # Handle OTP generation or resend
#             if otp is None:
#                 # Generate OTP if not provided
#                 no_user = CustomUser.objects.filter(email=identifier).first()

#                 if no_user:
#                     return Response({"error": "Login with OTP is available only via mobile number."}, status=status.HTTP_404_NOT_FOUND)
                
#                 user = CustomUser.objects.filter(mobile_number=identifier).first()
#                 if user:
#                     otp = get_random_string(length=4, allowed_chars='0123456789')
#                     cache_key = f"otp_{identifier}"

#                     # Clear old OTP data if it exists
#                     cache.delete(cache_key)

#                     # Cache the new OTP for 5 minutes
#                     cache.set(cache_key, {"otp": otp, "user_id": user.id}, timeout=300)
#                     send_sms(user.mobile_number, f"Your OTP is: {otp}")
#                     return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)

#                 return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

#             # Verify OTP
#             cache_key = f"otp_{identifier}"
#             cached_data = cache.get(cache_key)
#             if cached_data and cached_data['otp'] == otp:
#                 user = CustomUser.objects.get(id=cached_data['user_id'])
#                 tokens = get_tokens_for_user(user)
#                 return Response({"message": "Logged in successfully.", "tokens": tokens}, status=status.HTTP_200_OK)
#             return Response({"error": "Invalid OTP."}, status=status.HTTP_401_UNAUTHORIZED)

#         return Response({"error": "Invalid login type."}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """Handles user login via password or OTP."""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            identifier = data.get("identifier")  # Can be email or mobile number
            login_type = data.get("login_type")
            otp = data.get("otp", None)
            password = data.get("password", None)

            # Determine whether identifier is an email or mobile number
            user = CustomUser.objects.filter(email=identifier).first() or \
                   CustomUser.objects.filter(mobile_number=identifier).first()

            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            if login_type == "password":
                # Authenticate using password
                if not password:
                    return Response({"error": "Password is required for password login."}, status=status.HTTP_400_BAD_REQUEST)

                if not user.check_password(password):
                    return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)

            elif login_type == "otp":
                if not otp:
                    # Generate OTP and send via SMS
                    generated_otp = get_random_string(length=4, allowed_chars='0123456789')
                    cache_key = f"otp_{user.mobile_number}"
                    cache.set(cache_key, {"otp": generated_otp}, timeout=300)

                    message = f"Your login OTP is: {generated_otp} from Only2Bali. Best regards, Straits Partners"
                    send_sms(user.mobile_number, message)

                    return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)

                else:
                    # Validate OTP
                    cache_key = f"otp_{user.mobile_number}"
                    cached_data = cache.get(cache_key)

                    if not cached_data or cached_data['otp'] != otp:
                        return Response({"error": "Invalid OTP or expired."}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Generate JWT tokens after successful OTP verification
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "message": "Login successful",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid login type."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# # correct code for Send OTP via email or SMS

# from django.core.mail import send_mail
# from twilio.rest import Client
# from django.conf import settings

# class LoginView(APIView):
#     """
#     Handles login via password or OTP.
#     Returns JWT tokens upon successful authentication.
#     """
#     def post(self, request):
#         login_type = request.data.get('login_type', 'password')  # Default to password login
#         identifier = request.data.get('identifier')  # Can be email or mobile number
#         password = request.data.get('password', None)
#         otp = request.data.get('otp', None)

#         if login_type == 'password':
#             # Authenticate using email or mobile number and password
#             user = CustomUser.objects.filter(email=identifier).first() or CustomUser.objects.filter(mobile_number=identifier).first()
#             if user:
#                 user = authenticate(username=user.username, password=password)
#                 if user:
#                     tokens = get_tokens_for_user(user)
#                     return Response({"message": "Logged in successfully.", "tokens": tokens}, status=status.HTTP_200_OK)
#             return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

#         elif login_type == 'otp':
#             # Ensure identifier is provided
#             if not identifier:
#                 return Response({"error": "Email or mobile number is required for OTP login."}, status=status.HTTP_400_BAD_REQUEST)

#             user = CustomUser.objects.filter(email=identifier).first() or CustomUser.objects.filter(mobile_number=identifier).first()
#             if not user:
#                 return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

#             cache_key = f"otp_{identifier}"

#             if otp is None:
#                 # Generate OTP if not provided
#                 otp = get_random_string(length=4, allowed_chars='0123456789')

#                 # Clear old OTP data if it exists
#                 cache.delete(cache_key)

#                 # Cache the new OTP for 5 minutes
#                 cache.set(cache_key, {"otp": otp, "user_id": user.id}, timeout=300)

#                 # Send OTP via SMS if it's a mobile number, otherwise via email
#                 if identifier.isdigit():  # Check if it's a mobile number
#                     send_sms(identifier, f"Your OTP is: {otp}")
#                 else:  # Otherwise, assume it's an email
#                     send_email(identifier, otp)

#                 return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)

#             # Verify OTP
#             cached_data = cache.get(cache_key)
#             if cached_data and cached_data['otp'] == otp:
#                 user = CustomUser.objects.get(id=cached_data['user_id'])
#                 tokens = get_tokens_for_user(user)
#                 return Response({"message": "Logged in successfully.", "tokens": tokens}, status=status.HTTP_200_OK)
            
#             return Response({"error": "Invalid OTP."}, status=status.HTTP_401_UNAUTHORIZED)

#         return Response({"error": "Invalid login type."}, status=status.HTTP_400_BAD_REQUEST)

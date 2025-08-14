from django.shortcuts import render


from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_test_data(request):
    """
    Yeh ek test view hai jo ek simple message bhejega.
    """
    data = {'message': 'Hello from Django! Your backend is connected.'}
    return Response(data)
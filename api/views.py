# api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection # Yeh import zaroori hai

@api_view(['GET'])
def get_test_data(request):
    data = {'message': 'Hello from Django! Your backend is connected.'}
    return Response(data)

# Yeh naya view hai
@api_view(['GET'])
def debug_database_connection(request):
    db_settings = connection.settings_dict
    db_name = db_settings.get('NAME')
    db_engine = db_settings.get('ENGINE')
    
    # Yeh line terminal mein print hogi
    print("--- DATABASE DEBUGGER ---")
    print(f"DATABASE NAME IN USE: {db_name}")
    print(f"DATABASE ENGINE IN USE: {db_engine}")
    print("-------------------------")
    
    return Response({
        "database_name": db_name,
        "database_engine": db_engine
    })
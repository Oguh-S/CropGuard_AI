from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import PredictionSerializer
from .ml_model import predict_disease
from .advice import advice_for


class PredictView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PredictionSerializer(data=request.data)

        if serializer.is_valid():
            image = serializer.validated_data["image"]

            try:
                result = predict_disease(image)
                result["advice"] = advice_for(result["disease"])
                return Response({
                    "success": True,
                    "prediction": result
                })

            except Exception as e:
                return Response({
                    "success": False,
                    "error": str(e)
                }, status=500)

        return Response(serializer.errors, status=400)


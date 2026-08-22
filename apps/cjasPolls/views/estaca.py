from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Estaca
from ..serializers.EstacaSerializer import EstacaSerializer

# #UTilizando ListApiView
# class EstacaListView(generics.ListAPIView):
#     queryset = Estaca.objects.all()
#     serializer_class = EstacaSerializer

class EstacaListView(APIView):
    def get(self, request):
        estacas = Estaca.objects.all()
        serializer = EstacaSerializer(estacas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

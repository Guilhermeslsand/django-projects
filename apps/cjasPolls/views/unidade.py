from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from ..models import Unidade, Estaca
from ..serializers.UnidadeSerializer import UnidadeSerializer

#Usando o ListApiView
class UnidadeListView(generics.ListAPIView):
    serializer_class = UnidadeSerializer

    def get_queryset(self):
        estaca_id = self.kwargs["estaca_id"]

        if not Estaca.objects.filter(id=estaca_id).exists():
            raise NotFound(
                "A estaca informaada não foi encontrada"
            )

        return Unidade.objects.filter(
            estaca_id=estaca_id
        )

# class UnidadeListView(APIView):
#     def get(self, request, estaca_id):
#         unidades = Unidade.objects.filter(estaca_id=estaca_id)
#         serializer = UnidadeSerializer(unidades, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)




    
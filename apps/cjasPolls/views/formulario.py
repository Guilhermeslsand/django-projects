from rest_framework import generics

from ..models import FormularioCJAS
from ..serializers.FormularioCJASSerializer import FormularioCJASSerializer

class FormularioCJASCreateView(generics.CreateAPIView):

    queryset = FormularioCJAS.objects.all()
    serializer_class = FormularioCJASSerializer
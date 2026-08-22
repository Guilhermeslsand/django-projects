from rest_framework import serializers

from ..models import Estaca


class EstacaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Estaca

        fields = [
            "id",
            "nome",
        ]

        read_only_fields = [
            "id",
        ]
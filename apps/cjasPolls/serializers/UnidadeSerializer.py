from rest_framework import serializers

from ..models import Unidade


class UnidadeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Unidade

        fields = [
            "id",
            "nome",
        ]

        read_only_fields = [
            "id",
        ]
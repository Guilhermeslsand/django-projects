from rest_framework import serializers

from ..models import (
    FormularioCJAS,
)

class FormularioCJASSerializer(serializers.ModelSerializer):

    class Meta:
        model = FormularioCJAS
        fields = [
            "id",
            "nome_completo",
            "estaca",
            "unidade",
            "vai_cjas",
            "vai_onibus_sexta",
            "horario_chegada_sabado",
            "recebeu_qr_code",
            "tem_familiar_cjas",
            "familiar_nome",
            "compartilhar_cama",
            "precisa_contato_saude",
            "motivo_nao_participacao",
            "motivos_outros",
            "criado",
            "atualizado",
        ]

        read_only_fields = [
            "id",
            "criado",
            "atualizado",
        ]

    def validate(self, attrs):

        nome_completo = attrs.get("nome_completo")
        estaca = attrs.get("estaca")
        unidade = attrs.get("unidade")

        vai_cjas = attrs.get("vai_cjas")
        vai_onibus_sexta = attrs.get("vai_onibus_sexta")
        horario = attrs.get("horario_chegada_sabado")

        tem_familiar_cjas = attrs.get("tem_familiar_cjas")
        familiar_nome = attrs.get("familiar_nome")
        compartilhar_cama = attrs.get("compartilhar_cama")

        motivo = attrs.get("motivo_nao_participacao")
        motivos_outros = attrs.get("motivos_outros")

        # --------------------------------------------------
        # Dados Pessoais
        # --------------------------------------------------
        if not nome_completo:
            raise serializers.ValidationError({
                "nome_completo": (
                    "Informe o seu nome completo."
                )
            })

        if not estaca:
            raise serializers.ValidationError({
                "estaca": (
                    "Informe a sua estaca."
                )
            })

        if not unidade:
            raise serializers.ValidationError({
                "unidade": (
                    "Informe a sua unidade."
                )
            })

        if unidade.estaca_id != estaca.id:
            raise serializers.ValidationError({
                "unidade": (
                    "A unidade selecionada não pertence à estaca informada."
                )
            })


        # --------------------------------------------------
        # NÃO VAI AO CJAS
        # --------------------------------------------------
        if not vai_cjas:
            if not motivo:
                raise serializers.ValidationError({
                    "motivo_nao_participacao": (
                        "informe o motivo pelo qual não irá participar do Cjas."
                    )
                })

            if motivo == "OUTROS" and not motivos_outros:
                raise serializers.ValidationError({
                    "motivos_outros":(
                        "Explique o motivo da sua ausência."
                    )
                })

            attrs["vai_onibus_sexta"] = None
            attrs["horario_chegada_sabado"] = None
            attrs["tem_familiar_cjas"] = None
            attrs["familiar_nome"] = None
            attrs["compartilhar_cama"] = None

        #CASO VAI PARA O CJAS
        else:
            # Não deve existir motivo de ausência
            attrs["motivo_nao_participacao"] = None
            attrs["motivos_outros"] = ""


            # --------------------------------------------------
            # ÔNIBUS
            # --------------------------------------------------

            if vai_onibus_sexta:
                # Se vai no ônibus, não precisa
                # informar chegada no sábado.
                attrs["horario_chegada_sabado"] = None

            else:
                if not horario:
                    raise serializers.ValidationError({
                        "horario_chegada_sabado": (
                            "Informe o horário previsto de chegada no sábado."
                        )
                    }) 
    
            # --------------------------------------------------
            # FAMILIAR
            # --------------------------------------------------

            if tem_familiar_cjas:
                if not familiar_nome:
                    raise serializers.ValidationError({
                        "familiar_nome": (
                            "Informe o nome do familiar."
                        )
                    })

                if compartilhar_cama is None:
                    raise serializers.ValidationError({
                        "compartilhar_cama": (
                            "Informe se poderá compartilhar cama ou não."
                        )
                    })

            else:

                attrs["familiar_nome"] = ""
                attrs["compartilhar_cama"] = None

        return attrs
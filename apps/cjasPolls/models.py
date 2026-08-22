from django.db import models

# Create your models here.
class Estaca(models.Model):
    nome = models.CharField(
        max_length=150,
        unique=True
    )

    criado = models.DateTimeField(
        auto_now_add=True
    )
    atualizado = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "estacas"
        ordering = ["nome"]

    def __str__(self):
        return self.nome

class Unidade(models.Model):
    estaca = models.ForeignKey(
        Estaca,
        on_delete=models.PROTECT,
        related_name="unidades"
    )

    nome = models.CharField(max_length=150)
    criado = models.DateTimeField(
            auto_now_add=True
    )
    atualizado = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "unidades"
        ordering = ["nome"]

        constraints = [
            models.UniqueConstraint(
                fields=["estaca","nome"],
                name="unique_unidade_estaca",
            )
        ]

    def __str__(self):
        return self.nome


class MotivoNaoParticiapacao(models.TextChoices):
    TRABALHO = "TRABALHO", "Vou trabalhar durante o Cjas"
    VIAGEM = "VIAGEM", "Vou viajar para outro lugar durante o Cjas"
    NAO_QUERO = "NAO_QUERO", "Não quero mais participar"
    OUTROS = "OUTROS", "Outro"

class FormularioCJAS(models.Model):

    # Identificação
    nome_completo = models.CharField(
        max_length=250
    )

    estaca = models.ForeignKey(
        Estaca,
        on_delete=models.PROTECT,
        related_name="formularios"
    )

    unidade = models.ForeignKey(
        Unidade,
        on_delete=models.PROTECT,
        related_name="formularios"
    )

    # Pergunta 1
    vai_cjas = models.BooleanField()

    motivo_nao_participacao = models.CharField(
        max_length=30,
        choices=MotivoNaoParticiapacao.choices,
        blank=True,
        null=True,
    )

    motivos_outros = models.TextField(
        blank=True
    )

    # Pergunta 2
    vai_onibus_sexta = models.BooleanField(
        null=True,
        blank=True,
    )


    horario_chegada_sabado = models.TimeField(
        blank=True,
        null=True,
    )

    #Pergunta 3
    recebeu_qr_code = models.BooleanField(
        null=True,
        blank=True,
    )

    #Pergunta 4
    tem_familiar_cjas = models.BooleanField(
        null=True,
        blank=True,
    )

    familiar_nome = models.CharField(
        max_length=250,
        blank=True,
        null=True,
    )

    compartilhar_cama = models.BooleanField(
        blank=True,
        null=True,
    )

    #Pergunta 5
    precisa_contato_saude = models.BooleanField(
        null=True,
        blank=True,
    )

    criado = models.DateTimeField(
                auto_now_add=True
        )
    atualizado = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "formularios_cjas"
        ordering = ["-criado"]

    def __str__(self):
        return f"{self.nome_completo} - {self.estaca.nome}"


from django.urls import path
from .views.estaca import EstacaListView
from .views.unidade import UnidadeListView
from .views.formulario import FormularioCJASCreateView

urlpatterns = [
    path("estacas/",EstacaListView.as_view(), name="estaca-list"),
    path("estacas/<int:estaca_id>/unidades/", UnidadeListView.as_view(), name="unidade-list"),
    path("formularios/", FormularioCJASCreateView.as_view(), name="formulario-create")
]
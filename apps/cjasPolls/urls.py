from django.urls import path, include

from .views import views


urlpatterns = [
    path("", views.formulario_page, name="formulario_page"),
    path("sucesso/", views.sucesso_formulario, name="sucesso-formulario-page"),
    # Qualquer URL dentro de api_urls.py vai começar com "api/"
    path("api/V1/", include("apps.cjasPolls.api_urls")),
]
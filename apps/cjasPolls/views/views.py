from django.shortcuts import render
from django.http import HttpResponse

def formulario_page(request):
    return render(
        request,
        "cjasPolls/formulario.html"
    )

def sucesso_formulario(request):
    return render(
        request,
        "cjasPolls/sucesso.html"
    )
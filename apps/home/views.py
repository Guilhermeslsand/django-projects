from django.shortcuts import render
from django.shortcuts import redirect

# Create your views here.
def home(request):
    # O Django vai procurar a rota 'formulario_cjas' dentro do app 'cjas'
    return redirect('/cjas/')
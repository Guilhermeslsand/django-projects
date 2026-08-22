from django.contrib import admin
from apps.cjasPolls.models import Estaca,Unidade,FormularioCJAS

# Register your models here.
admin.site.register(Estaca)
admin.site.register(Unidade)
admin.site.register(FormularioCJAS)
from django.contrib import admin
from .models import Paciente, HistorialDiagnostico

admin.site.register(Paciente)
admin.site.register(HistorialDiagnostico)
# Register your models here.

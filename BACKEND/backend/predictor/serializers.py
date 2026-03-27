from rest_framework import serializers
from .models import HistorialDiagnostico, Paciente, UsuarioMedico

class UsuarioMedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioMedico
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class HistorialDiagnosticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialDiagnostico
        fields = '__all__'
        extra_kwargs = {
            'id': {'required': False}
        }
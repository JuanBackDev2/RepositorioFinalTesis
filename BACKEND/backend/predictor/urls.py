from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (PredictView, UsuarioMedicoViewSet, PacienteViewSet,HistorialDiagnosticoViewSet, login_view)



router = DefaultRouter()
router.register(r'usuarios', UsuarioMedicoViewSet)
router.register(r'pacientes', PacienteViewSet)             
router.register(r'diagnosticos', HistorialDiagnosticoViewSet)


urlpatterns = [
    path('predict/', PredictView.as_view(), name='predict'),
    path('', include(router.urls)),
    path('login/', login_view),
]

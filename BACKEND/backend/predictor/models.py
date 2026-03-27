from django.db import models
from django.contrib.auth.models import User

class UsuarioMedico(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

class Paciente(models.Model):
    usuario = models.ForeignKey(
        UsuarioMedico,
        on_delete=models.CASCADE,
        related_name='pacientes'
    )
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    status = models.CharField(max_length=20)
    lastVisit = models.DateField()

    def __str__(self):
        return self.name

class HistorialDiagnostico(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('CRITICAL', 'CRITICAL'),
        ('STABLE','Stable')
    ]

    id = models.CharField(max_length=20, primary_key=True)

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='diagnosticos'
    )

    summary = models.TextField()
    date = models.DateField()
    imageUrl = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

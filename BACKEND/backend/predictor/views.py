import os
import uuid

from django.shortcuts import render
from rest_framework import viewsets
from .models import HistorialDiagnostico, Paciente, UsuarioMedico
from .serializers import HistorialDiagnosticoSerializer, PacienteSerializer, UsuarioMedicoSerializer
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import generate_feedback, predict_image
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from azure.storage.blob import BlobServiceClient
from datetime import datetime
from azure.storage.blob import ContentSettings

class PredictView(APIView):
    
    connection_string = os.getenv("azure")
    container_name = "images"

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # 🔥 CORREGIDO
    def upload_to_azure(self, file):
        filename = f"{datetime.now().timestamp()}_{file.name}"

        blob_client = self.blob_service_client.get_blob_client(
            container=self.container_name,
            blob=filename
        )

        blob_client.upload_blob(
        file,
        overwrite=True,
        content_settings=ContentSettings(content_type=file.content_type)
         )

        return blob_client.url


    def post(self, request):
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({'error': 'No image uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        image_url = self.upload_to_azure(file_obj)
        file_obj.seek(0)
        file_path = default_storage.save('temp.jpg', file_obj)
        result = predict_image(file_path)

        predicted_class = result["predicted_class"]
        scores = result["scores"]

        confidence = scores[0][predicted_class] * 100

        # Define tus etiquetas
        class_names = [
            "No diabetic retinopathy",
            "Mild diabetic retinopathy",
            "Moderate diabetic retinopathy",
            "Severe diabetic retinopathy",
            "Proliferative diabetic retinopathy",
        ]

        label = class_names[predicted_class]

        feedback = generate_feedback(label, confidence)

        return Response({
            "predicted_class": label,
            "confidence": round(confidence, 2),
            "scores": scores,
            "feedback": feedback,
            "image_url": image_url
        })
        #Aqui retornarle también la url de la imagen guardada en aws, para usarlo cuando de click en save analysis


class UsuarioMedicoViewSet(viewsets.ModelViewSet):
    queryset = UsuarioMedico.objects.all()
    serializer_class = UsuarioMedicoSerializer

    def perform_create(self, serializer):
        serializer.save(password=make_password(serializer.validated_data['password']))


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    def perform_create(self, serializer):
        serializer.save(usuario_id=self.request.data.get('usuario'))

    def get_queryset(self):
        usuario_id = self.request.query_params.get('usuario')
        if usuario_id:
            return Paciente.objects.filter(usuario_id=usuario_id)
        return super().get_queryset()
    

class HistorialDiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = HistorialDiagnostico.objects.all()
    serializer_class = HistorialDiagnosticoSerializer

    # 👉 crear diagnóstico
    def perform_create(self, serializer):
        serializer.save(
        id=str(uuid.uuid4())[:20],
        paciente_id=self.request.data.get('paciente')
    )

    # 👉 opcional: filtrar por paciente
    def get_queryset(self):
        paciente_id = self.request.query_params.get('paciente')
        if paciente_id:
            return HistorialDiagnostico.objects.filter(paciente_id=paciente_id)
        return super().get_queryset()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = UsuarioMedico.objects.get(email=email)

        if check_password(password, user.password):
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email
            })
        else:
            return Response({"error": "Invalid password"}, status=400)

    except UsuarioMedico.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
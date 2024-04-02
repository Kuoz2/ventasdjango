from django.db import models

# Create your models here.


class categorias(models.Model):
    id=models.AutoField(primary_key=True)
    cnombre=models.CharField(max_length=30)
    def __str__(self):
        texto= "{0} ({1})"
        return texto.format(self.cnombre)
    
class productos(models.Model):
    id=models.AutoField(primary_key=True)
    pcodigo=models.CharField(max_length=100)
    nombre=models.CharField(max_length=100)
    precio=models.IntegerField()
    precioiva=models.IntegerField()
    fechain=models.CharField(max_length=100)
    cantidad=models.IntegerField()
    categoryid=models.ForeignKey(categorias, on_delete=models.CASCADE, db_column='categoryid')
    fechavenci=models.CharField(max_length=100)
    def __str__(self):
        texto= "{0} ({1})"
        return texto.format(self.nombre, self.fechain,self.fechavenci, self.pcodigo)
    
 
class ventas(models.Model):
    id=models.AutoField(primary_key= True)
    preciov=models.IntegerField()
    cantidadv=models.IntegerField()
    fechav=models.CharField(max_length=10)
    metodov=models.CharField(max_length=20)
    productoid=models.ForeignKey(productos, on_delete=models.CASCADE, db_column='productoid')
    productoin=models.CharField(max_length=100)
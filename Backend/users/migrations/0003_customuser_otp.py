# Generated by Django 5.1.4 on 2024-12-06 09:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_remove_customuser_otp"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="otp",
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]

# Generated by Django 5.1.4 on 2024-12-28 09:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("journeys", "0026_rename_vehicle_type_vehiclepreferences_vehicle_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vehiclepreferences",
            name="include_driver",
            field=models.CharField(
                choices=[("yes", "Yes"), ("no", "No")], max_length=20
            ),
        ),
    ]

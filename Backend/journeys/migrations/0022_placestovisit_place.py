# Generated by Django 5.1.4 on 2024-12-27 09:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("journeys", "0021_remove_placestovisit_place"),
    ]

    operations = [
        migrations.AddField(
            model_name="placestovisit",
            name="place",
            field=models.ManyToManyField(to="journeys.place"),
        ),
    ]

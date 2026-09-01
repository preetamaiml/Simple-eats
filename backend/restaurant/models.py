from django.db import models

from django.db import models


class MenuItem(models.Model):

    name = models.CharField(max_length=200)

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    category = models.CharField(max_length=100)

    image = models.CharField(
        max_length=255,
        blank=True
    )

    available = models.BooleanField(default=True)

    is_special = models.BooleanField(default=False)

    prep_time = models.PositiveIntegerField(
        help_text="Preparation time in minutes"
    )

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0
    )

    reviews = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

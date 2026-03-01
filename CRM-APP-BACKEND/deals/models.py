from django.db import models


class Deal(models.Model):
    STAGE_CHOICES = [
        ('Appointment Scheduled', 'Appointment Scheduled'),
        ('Qualified to Buy', 'Qualified to Buy'),
        ('Presentation Scheduled', 'Presentation Scheduled'),
        ('Decision Maker Bought In', 'Decision Maker Bought In'),
        ('Contract Sent', 'Contract Sent'),
        ('Closed Won', 'Closed Won'),
        ('Closed Lost', 'Closed Lost'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    name = models.CharField(max_length=200)
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='Appointment Scheduled')
    close_date = models.DateField()
    owner = models.CharField(max_length=100, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created = models.DateField(auto_now_add=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')

    def __str__(self):
        return self.name


class DealActivity(models.Model):
    TYPE_CHOICES = [
        ('task', 'Task'),
        ('note', 'Note'),
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
    ]

    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    created_by = models.CharField(max_length=100, default='You')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Deal Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title}"

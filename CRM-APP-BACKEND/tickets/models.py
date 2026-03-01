from django.db import models


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Waiting on us', 'Waiting on us'),
        ('Waiting on contact', 'Waiting on contact'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    SOURCE_CHOICES = [
        ('Chat', 'Chat'),
        ('Email', 'Email'),
        ('Phone', 'Phone'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='New')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='Email')
    owner = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    created = models.DateField(auto_now_add=True)
    associated_deal = models.CharField(max_length=200, blank=True)
    associated_company = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class TicketActivity(models.Model):
    TYPE_CHOICES = [
        ('task', 'Task'),
        ('note', 'Note'),
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
    ]

    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='activities')
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
        verbose_name_plural = "Ticket Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title}"

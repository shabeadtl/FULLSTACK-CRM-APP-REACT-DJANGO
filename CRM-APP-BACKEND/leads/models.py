from django.db import models


class Lead(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Qualified', 'Qualified'),
        ('Qualified Lead', 'Qualified Lead'),
        ('Lost', 'Lost'),
        ('Bad Info', 'Bad Info'),
        ('Converted', 'Converted'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='New')
    title = models.CharField(max_length=100, blank=True)
    owner = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True)
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"


class LeadActivity(models.Model):
    TYPE_CHOICES = [
        ('task', 'Task'),
        ('note', 'Note'),
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
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
        verbose_name_plural = "Lead Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title}"

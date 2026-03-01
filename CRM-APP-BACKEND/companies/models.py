from django.db import models


class Company(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Pending', 'Pending'),
    ]

    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    contact = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    employees = models.CharField(max_length=50, blank=True)
    revenue = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name


class CompanyActivity(models.Model):
    TYPE_CHOICES = [
        ('task', 'Task'),
        ('note', 'Note'),
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='activities')
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
        verbose_name_plural = "Company Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title}"

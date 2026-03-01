from django.core.management.base import BaseCommand
from leads.models import Lead
from companies.models import Company
from tickets.models import Ticket
from deals.models import Deal
from datetime import date


class Command(BaseCommand):
    help = 'Seed database with initial CRM data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding leads...')
        leads_data = [
            {'first_name': 'John', 'last_name': 'Doe', 'email': 'johndoe@email.com',
             'phone': '+1 234 567 8901', 'status': 'New', 'title': 'Marketing Manager',
             'owner': 'Maria Johnson', 'role': 'Marketing Manager'},
            {'first_name': 'Jane', 'last_name': 'Smith', 'email': 'janesmith@email.com',
             'phone': '+1 234 567 8902', 'status': 'Open', 'title': 'Sales Director',
             'owner': 'John Cooper', 'role': 'Sales Director'},
            {'first_name': 'Robert', 'last_name': 'Brown', 'email': 'robertb@email.com',
             'phone': '+1 234 567 8903', 'status': 'In Progress', 'title': 'Product Manager',
             'owner': 'Maria Johnson', 'role': 'Product Manager'},
            {'first_name': 'Emily', 'last_name': 'Davis', 'email': 'emilyd@email.com',
             'phone': '+1 234 567 8904', 'status': 'New', 'title': 'Business Analyst',
             'owner': 'John Cooper', 'role': 'Business Analyst'},
            {'first_name': 'Michael', 'last_name': 'Wilson', 'email': 'michaelw@email.com',
             'phone': '+1 234 567 8905', 'status': 'Lost', 'title': 'CEO',
             'owner': 'Maria Johnson', 'role': 'CEO'},
            {'first_name': 'Sarah', 'last_name': 'Johnson', 'email': 'sarahj@email.com',
             'phone': '+1 234 567 8906', 'status': 'Open', 'title': 'HR Manager',
             'owner': 'John Cooper', 'role': 'HR Manager'},
            {'first_name': 'David', 'last_name': 'Lee', 'email': 'davidl@email.com',
             'phone': '+1 234 567 8907', 'status': 'Bad Info', 'title': 'Developer',
             'owner': 'Maria Johnson', 'role': 'Developer'},
            {'first_name': 'Amanda', 'last_name': 'Clark', 'email': 'amandac@email.com',
             'phone': '+1 234 567 8908', 'status': 'New', 'title': 'Designer',
             'owner': 'John Cooper', 'role': 'Designer'},
        ]
        for data in leads_data:
            Lead.objects.get_or_create(email=data['email'], defaults=data)

        self.stdout.write('Seeding companies...')
        companies_data = [
            {'name': 'Tech Solutions Inc.', 'industry': 'Technology', 'status': 'Active',
             'contact': 'John Smith', 'email': 'contact@techsolutions.com',
             'phone': '+1 555-0101', 'location': 'San Francisco, CA',
             'website': 'https://www.techsolutions.com', 'employees': '50-100',
             'revenue': '$5M - $10M',
             'description': 'Leading technology solutions provider specializing in cloud computing and AI.'},
            {'name': 'Global Marketing Co.', 'industry': 'Marketing', 'status': 'Active',
             'contact': 'Sarah Johnson', 'email': 'info@globalmarketing.com',
             'phone': '+1 555-0102', 'location': 'New York, NY',
             'website': 'https://www.globalmarketing.com', 'employees': '100-250',
             'revenue': '$10M - $25M',
             'description': 'Full-service marketing agency with global reach.'},
            {'name': 'FinanceHub Ltd.', 'industry': 'Finance', 'status': 'Inactive',
             'contact': 'Michael Brown', 'email': 'support@financehub.com',
             'phone': '+1 555-0103', 'location': 'Chicago, IL',
             'website': 'https://www.financehub.com', 'employees': '25-50',
             'revenue': '$2M - $5M',
             'description': 'Financial consulting and investment management services.'},
            {'name': 'Healthcare Plus', 'industry': 'Healthcare', 'status': 'Active',
             'contact': 'Emily Davis', 'email': 'hello@healthcareplus.com',
             'phone': '+1 555-0104', 'location': 'Boston, MA',
             'website': 'https://www.healthcareplus.com', 'employees': '250-500',
             'revenue': '$25M - $50M',
             'description': 'Healthcare services and medical equipment provider.'},
            {'name': 'EduTech Academy', 'industry': 'Education', 'status': 'Pending',
             'contact': 'David Wilson', 'email': 'admin@edutechacademy.com',
             'phone': '+1 555-0105', 'location': 'Austin, TX',
             'website': 'https://www.edutechacademy.com', 'employees': '10-25',
             'revenue': '$1M - $2M',
             'description': 'Online education platform for professional development.'},
        ]
        for data in companies_data:
            Company.objects.get_or_create(name=data['name'], defaults=data)

        self.stdout.write('Seeding tickets...')
        tickets_data = [
            {'name': 'Login page not loading', 'description': 'Users are reporting that the login page shows a blank white screen on Chrome browsers.',
             'status': 'New', 'priority': 'Critical', 'source': 'Email',
             'owner': 'Jane Cooper', 'city': 'New York', 'associated_company': 'Tech Solutions Inc.'},
            {'name': 'Dashboard data mismatch', 'description': 'Revenue figures on the dashboard do not match the actual sales records.',
             'status': 'Waiting on us', 'priority': 'High', 'source': 'Phone',
             'owner': 'Wade Warren', 'city': 'San Francisco', 'associated_company': 'Healthcare Plus'},
            {'name': 'Contact form submission error', 'description': 'Contact form throws 500 error when users try to submit with attachments.',
             'status': 'Waiting on contact', 'priority': 'Medium', 'source': 'Chat',
             'owner': 'Brooklyn Simmons', 'city': 'Chicago', 'associated_company': 'Global Marketing Co.'},
            {'name': 'Email notifications not sent', 'description': 'System email notifications for new leads are not being delivered to assigned team members.',
             'status': 'New', 'priority': 'High', 'source': 'Email',
             'owner': 'Leslie Alexander', 'city': 'Boston', 'associated_company': 'EduTech Academy'},
            {'name': 'Report export failing', 'description': 'PDF export of monthly reports fails with a timeout error for reports with more than 100 entries.',
             'status': 'Waiting on us', 'priority': 'Medium', 'source': 'Chat',
             'owner': 'Jenny Wilson', 'city': 'Austin', 'associated_company': 'FinanceHub Ltd.'},
            {'name': 'Mobile layout broken', 'description': 'The deals page layout is completely broken on mobile devices.',
             'status': 'Waiting on us', 'priority': 'Critical', 'source': 'Phone',
             'owner': 'Guy Hawkins', 'city': 'Seattle', 'associated_company': 'Tech Solutions Inc.'},
            {'name': 'Search feature returns wrong results', 'description': 'Global search returns unrelated results when using special characters.',
             'status': 'New', 'priority': 'Medium', 'source': 'Email',
             'owner': 'Robert Fox', 'city': 'Denver', 'associated_company': 'Global Marketing Co.'},
            {'name': 'Slow page load times', 'description': 'Users are experiencing slow page load times.',
             'status': 'Waiting on contact', 'priority': 'High', 'source': 'Chat',
             'owner': 'Jane Cooper', 'city': 'Los Angeles', 'associated_company': 'FinanceHub Ltd.'},
        ]
        for data in tickets_data:
            Ticket.objects.get_or_create(name=data['name'], defaults=data)

        self.stdout.write('Seeding deals...')
        deals_data = [
            {'name': 'Website Revamp - Atlas Corp', 'stage': 'Presentation Scheduled',
             'close_date': date(2025, 4, 8), 'owner': 'Jane Cooper', 'amount': 12500, 'priority': 'High'},
            {'name': 'CRM System - TechNova', 'stage': 'Appointment Scheduled',
             'close_date': date(2025, 4, 10), 'owner': 'Wade Warren', 'amount': 8700, 'priority': 'Medium'},
            {'name': 'Mobile App - UrbanEats', 'stage': 'Qualified to Buy',
             'close_date': date(2025, 4, 15), 'owner': 'Brooklyn Simmons', 'amount': 22000, 'priority': 'Critical'},
            {'name': 'SEO Package - FreshFarm', 'stage': 'Contract Sent',
             'close_date': date(2025, 4, 5), 'owner': 'Cameron Williamson', 'amount': 3200, 'priority': 'Low'},
            {'name': 'Data Analytics - Pinnacle', 'stage': 'Closed Won',
             'close_date': date(2025, 4, 1), 'owner': 'Leslie Alexander', 'amount': 15800, 'priority': 'High'},
            {'name': 'Inventory Tool - GreenMart', 'stage': 'Decision Maker Bought In',
             'close_date': date(2025, 4, 8), 'owner': 'Guy Hawkins', 'amount': 9300, 'priority': 'Low'},
            {'name': 'ERP Integration - BlueChip', 'stage': 'Qualified to Buy',
             'close_date': date(2025, 4, 8), 'owner': 'Robert Fox', 'amount': 41000, 'priority': 'High'},
            {'name': 'Loyalty Program - FoodieFox', 'stage': 'Closed Lost',
             'close_date': date(2025, 4, 8), 'owner': 'Cameron Williamson', 'amount': 11000, 'priority': 'Medium'},
        ]
        for data in deals_data:
            Deal.objects.get_or_create(name=data['name'], defaults=data)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

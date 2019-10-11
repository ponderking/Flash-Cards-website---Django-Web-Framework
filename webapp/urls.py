from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    # JSON web services
    path('user/', views.current_user, name='current_user'),
    path('stack/', views.card_stacks, name='card_stacks'),
    path('stack/<int:stack_id>', views.cards_by_stack, name='cards_by_stack'),
    path('card/<int:card_id>', views.card_by_id, name='card_by_id'),
    path('remove_stack/<int:stack_id>', views.remove_stack, name='removestack'),
    path('remove_card/<int:card_id>', views.remove_card, name='removecard'),

    path('create_stack/', views.create_stack, name='createstack'),
    path('edit_stack/<int:stack_id>', views.edit_stack, name='editstack'),
    path('create_card/<int:stack_id>', views.create_card, name='createcard'),
    path('edit_card/<int:stack_id>/<int:card_id>', views.edit_card, name='editcard'),
    path('show_stack/<int:stack_id>', views.show_stack, name='showstack'),
]

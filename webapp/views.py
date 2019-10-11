from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib import messages
from django.core import serializers
from .models import User
from .models import FlashCardStack
from .models import FlashCard


# Create your views here.
def index(request):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        user = None
        stacks = FlashCardStack.objects.filter(is_public=True).order_by('-created')[:5]
        return render(request, 'webapp/presentation.html', {'user': None, 'stacks': stacks})
    else:
        # User is logged in.
        user = User.objects.get(pk=request.session['user']['id'])
        stacks = FlashCardStack.objects.filter(owner=user)

    return render(request, 'webapp/user.html', {'user': user, 'stacks': stacks})


def register(request):
    if request.method == "POST" and request.POST:
        user = User()
        user.username = request.POST['username']
        user.set_password(request.POST['password'])
        user.email = request.POST['email']

        try:
            user.save()
            messages.success(request, 'Success! Welcome, ', user.username)
            return redirect('/login/')
        except ValidationError as e:
            messages.error(request, 'Registration failed. ', e)
            print(e)
            return redirect('/register/')
    return render(request, 'webapp/login/signup.html', {'user': None})


def login(request):
    if request.method == "POST" and request.POST:
        try:
            user = User.objects.get(username=request.POST['username'])
            if not user.check_password(request.POST['password']):
                raise User.DoesNotExist
            if not user.active:
                raise User.DoesNotExist

            request.session['user'] = {'id': user.id,
                                       'username': user.username,
                                       'email': user.email}
            messages.success(request, 'Login success! Welcome, ', user.username)
        except:
            messages.error(request, 'Invalid username or password. ')
            return render(request, 'webapp/login/login.html')
        return redirect('index')
    else:
        return render(request, 'webapp/login/login.html', {'user': None})


def logout(request):
    del request.session['user']
    messages.success(request, 'You are now logged out. Please come back soon! ')
    return redirect('index')


def current_user(request):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return (HttpResponse("[]"))
    else:
        return (HttpResponse(serializers.serialize("json",
                                                   [User.objects.get(id=request.session['user']['id'])],
                                                   fields=(
                                                   'username', 'email', 'active', 'last_login', 'created', 'changed'))))


def current_stack_being_created(request):
    try:
        request.session['stack']
    except(KeyError, AttributeError):
        # User not logged in
        return (HttpResponse("[]"))
    else:
        return (HttpResponse(serializers.serialize("json",
                                                   [FlashCardStack.objects.get(id=request.session['stack'])],
                                                   fields=())))


def card_stacks(request):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return (HttpResponse("[]"))
    else:
        stacks = FlashCardStack.objects.filter(owner=User.objects.get(pk=request.session['user']['id']))
        jsondata = serializers.serialize("json", stacks,
                                         fields=('title', 'description', 'is_public', 'created', 'changed'))
        return (HttpResponse(jsondata))


def cards_by_stack(request, stack_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return (HttpResponse("[]"))
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        c = FlashCardStack.objects.get(pk=stack_id)
        cards = FlashCard.objects.filter(owner=u, cardstack=c)
        jsondata = serializers.serialize("json", cards)
        return (HttpResponse(jsondata))


def card_by_id(request, card_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return (HttpResponse("[]"))
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        card = FlashCard.objects.filter(owner=u, pk=card_id)
        jsondata = serializers.serialize("json", card)
        return (HttpResponse(jsondata))


def create_stack(request):
    if request.method == "POST":
        stack = FlashCardStack()
        stack.owner = User.objects.get(pk=request.session['user']['id'])
        stack.title = request.POST['title']
        stack.description = request.POST['description']
        if request.POST['is_public'] == "true":
            stack.is_public = True
        else:
            stack.is_public = False
        try:
            stack.save()
            messages.success(request, 'Success! Stack created.')
        except ValidationError as e:
            messages.error(request, 'Creating stack failed. ', e)
        return HttpResponse(stack.pk)
    return render(request, 'webapp/createstack.html')

def edit_stack(request, stack_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return redirect('login')
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        stack = FlashCardStack.objects.get(pk=stack_id, owner=u)
        cards = FlashCard.objects.filter(owner=u, cardstack=stack)
        if request.method == "POST" and request.POST:
            print(request.POST['title'])
            stack.title = request.POST['title']
            stack.description = request.POST['description']
            if request.POST['is_public'] == "true":
                stack.is_public = True
            else:
                stack.is_public = False
            try:
                stack.save()
                messages.success(request, 'Success! Stack updated.')
                return HttpResponse(stack_id)
            except ValidationError as e:
                messages.error(request, 'Updating stack failed. ', e)
        return render(request, 'webapp/modifystack.html', {'user': u, 'stack': stack, 'cards': cards})


def remove_stack(request, stack_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return redirect('login')
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        try:
            c = FlashCardStack.objects.get(pk=stack_id, owner=u)
            c.delete()
        except (ValidationError, ObjectDoesNotExist) as e:
            return HttpResponse(e)
        else:
            return HttpResponse("ok")


def create_card(request, stack_id):
    user = User.objects.get(pk=request.session['user']['id'])
    if request.method == "POST":
        card = FlashCard()
        card.owner = User.objects.get(pk=request.session['user']['id'])
        card.cardstack = FlashCardStack.objects.get(pk=stack_id)
        card.content_front = request.POST['content_front']
        card.content_back = request.POST['content_back']
        try:
            card.save()
            messages.success(request, 'Success! Card created.')
        except ValidationError as e:
            messages.error(request, 'Creating card failed. ', e)
        return HttpResponse(stack_id)
    return render(request, 'webapp/createcard.html', {'user': user})

def edit_card(request, stack_id, card_id):
    user = User.objects.get(pk=request.session['user']['id'])
    card = FlashCard.objects.get(pk=card_id)
    if request.method == "POST":
        card.content_front = request.POST['content_front']
        card.content_back = request.POST['content_back']
        try:
            card.save()
            messages.success(request, 'Success! Card updated.')
        except ValidationError as e:
            messages.error(request, 'Updating card failed. ', e)
        return HttpResponse(stack_id)
    return render(request, 'webapp/createcard.html', {'user': user, 'card': card})


def remove_card(request, card_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return redirect('login')
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        try:
            c = FlashCard.objects.filter(owner=u, pk=card_id)
            c.delete()
        except (ValidationError, ObjectDoesNotExist) as e:
            return HttpResponse(e)
        else:
            return HttpResponse("ok")


def show_stack(request, stack_id):
    try:
        request.session['user']
    except(KeyError, AttributeError):
        # User not logged in
        return redirect('login')
    else:
        u = User.objects.get(pk=request.session['user']['id'])
        c = FlashCardStack.objects.get(pk=stack_id, owner=u)
        return render(request, 'webapp/card.html', {'user': u, 'stack': c})

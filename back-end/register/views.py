from django.shortcuts import render, get_object_or_404
from core.models import Student, Teacher
from django.core.exceptions import ObjectDoesNotExist

def account(request):
    user = request.user

    is_student = False
    is_teacher = False

    # oh, this so ugly
    try:
        account_model = Student.objects.get(user__id=user.id)
        is_student = True
    except ObjectDoesNotExist:
        try:
            account_model = Teacher.objects.get(user__id=user.id)
            is_teacher = True
        except ObjectDoesNotExist:
            account_model = None

    context = {
        'account_model': account_model,
        'is_student': is_student,
        'is_teacher': is_teacher,
        }

    return render(request, 'account/profile.html', context)

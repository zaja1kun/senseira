from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from .models import *


def index(request):
    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    template = loader.get_template('core/index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

FROM python:3.6

RUN git clone https://github.com/zaja1kun/senseira.git -b mysql && \
  cd senseira/back-end && \
  pip install -r requirements.txt

EXPOSE 8080

CMD cd /senseira/back-end; \
  python manage.py migrate; \
  echo "from django.contrib.auth.models import User; User.objects.create_superuser('$SENSEIRA_ADMIN_NAME', '$SENSEIRA_ADMIN_MAIL', '$SENSEIRA_ADMIN_PSWD')" | python manage.py shell; \
  python manage.py runserver 0:8080

from django.contrib import admin
from .models import Student, Teacher, Subject, Group, Task, Variant


class SubjectInline(admin.TabularInline):
    model = Subject
    extra = 0


class VariantInline(admin.TabularInline):
    model = Variant
    extra = 0


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user', ]}),
    ]


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user', ]}),
    ]
    inlines = [SubjectInline, ]
    list_display = ('__str__', )


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['group_name', 'monitor']}),
        (Student._meta.verbose_name_plural, {'fields': ['students', ]}),
        (Subject._meta.verbose_name_plural, {'fields': ['get_subjects', ]}),
    ]
    list_display = ('group_name', 'monitor')
    readonly_fields = ['get_subjects', ]

    def get_subjects(self, obj):
        return obj.get_subjects()
    get_subjects.allow_tags = True
    get_subjects.short_description = ''


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['name', 'subject', 'description']}),
    ]
    inlines = [VariantInline]
    list_display = ('name', 'get_group', 'subject', 'get_teacher', 'get_description_preview')
    readonly_fields = ['get_description_preview', 'get_teacher', 'get_group']

    def get_description_preview(self, obj):
        return obj.get_description_preview()
    get_description_preview.short_description = Task._meta.get_field('description').verbose_name

    def get_teacher(self, obj):
        return obj.get_teacher()
    get_teacher.short_description = Teacher._meta.verbose_name

    def get_group(self, obj):
        return obj.get_group()
    get_group.short_description = Group._meta.verbose_name

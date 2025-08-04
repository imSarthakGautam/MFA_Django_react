from .base import *
import os
if os.getenv('DJANGO_ENV')=='development':
    from .development import *
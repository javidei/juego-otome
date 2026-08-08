define config.name = _("Entre líneas")
define config.version = "0.2.0"
define build.name = "entre-lineas"
define config.save_directory = "entre-lineas-1770000000"
define config.window = "auto"
define config.has_sound = True
define config.has_music = True
define config.has_voice = False
default preferences.text_cps = 35
default preferences.afm_time = 15

init python:
    build.classify("**~", None)
    build.classify("**.bak", None)
    build.classify("**/.**", None)
    build.documentation("*.html")

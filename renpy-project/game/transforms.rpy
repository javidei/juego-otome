transform escena_general:
    zoom 0.96
    xalign 0.5
    yalign 0.5

transform foco_javi:
    zoom 1.34
    xalign 0.14
    yalign 0.48
    ease 0.45 xalign 0.17

transform foco_sue:
    zoom 1.38
    xalign 0.50
    yalign 0.46

transform foco_smokey:
    zoom 1.34
    xalign 0.86
    yalign 0.48
    ease 0.45 xalign 0.83

transform pulso_suave:
    zoom 1.0
    ease 0.18 zoom 1.015
    ease 0.20 zoom 1.0

transform golpe_camara:
    xoffset 0
    linear 0.04 xoffset -14
    linear 0.04 xoffset 14
    linear 0.04 xoffset -9
    linear 0.04 xoffset 9
    linear 0.04 xoffset 0

transform pop_texto:
    alpha 0.0
    zoom 0.7
    easeout 0.18 alpha 1.0 zoom 1.08
    easein 0.12 zoom 1.0
    pause 0.55
    easein 0.2 alpha 0.0

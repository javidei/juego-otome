screen chapter_badge(text):
    zorder 20
    frame:
        xalign 0.025
        yalign 0.035
        padding (22, 10)
        background Solid("#130d0bcc")
        text text:
            color "#f3d18f"
            size 28

screen affinity_summary():
    modal True
    zorder 100
    add Solid("#090706dd")
    frame:
        xalign 0.5
        yalign 0.5
        xmaximum 760
        padding (42, 34)
        background Solid("#17100dee")
        vbox:
            spacing 18
            text "Fin de la demo" size 48 color "#f3d18f" xalign 0.5
            text "Esto es solo la base técnica en Ren'Py. Las situaciones y diálogos se sustituirán por la historia real." size 25 color "#f5eee5" text_align 0.5 xalign 0.5
            null height 8
            text "Afinidad" size 30 color "#e8b964" xalign 0.5
            text "Javi: [afinidad_javi]   ·   Sue: [afinidad_sue]   ·   Smokey: [afinidad_smokey]" size 24 color "#ffffff" xalign 0.5
            null height 12
            textbutton "Volver al menú":
                xalign 0.5
                action MainMenu(confirm=False)

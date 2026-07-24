import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
import os

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D1DCD6"):
    tblPr = table._tbl.tblPr
    borders_elm = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="{color}"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders_elm)

def add_callout_box(doc, text_list, title="UX DESIGN NOTE", border_color="0B8457", bg_color="F4F7F6"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=140)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="none"/>'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(f"📌 {title}\n")
    run_t.bold = True
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(10.5)
    run_t.font.color.rgb = RGBColor(11, 132, 87) if border_color=="0B8457" else RGBColor(217, 131, 16)
    
    for item in text_list:
        p_item = cell.add_paragraph()
        p_item.paragraph_format.space_after = Pt(3)
        p_item.paragraph_format.line_spacing = 1.15
        run_i = p_item.add_run(item)
        run_i.font.name = "Calibri"
        run_i.font.size = Pt(9.5)
        run_i.font.color.rgb = RGBColor(40, 50, 60)
        
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_screenshot_figure(doc, img_path, caption_text):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(2.8))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(10)
        run_cap = p_cap.add_run(f"Figuur: {caption_text}")
        run_cap.font.name = "Calibri"
        run_cap.font.size = Pt(9)
        run_cap.font.italic = True
        run_cap.font.color.rgb = RGBColor(90, 106, 117)

def build_docx():
    doc = Document()
    
    brain_dir = '/Users/melkonian/.gemini/antigravity-ide/brain/c6315284-cea7-4995-a87b-752c0862c7bd'
    img_main = os.path.join(brain_dir, 'media__1784836812683.png')
    img_select = os.path.join(brain_dir, 'media__1784836812605.png')
    img_settings = os.path.join(brain_dir, 'media__1784836812579.png')
    img_reward = os.path.join(brain_dir, 'media__1784836812572.png')

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(26, 37, 44)
    
    TEAL = RGBColor(11, 132, 87)       # #0B8457
    GOLD = RGBColor(217, 131, 16)      # #D98310
    GRAY = RGBColor(90, 106, 117)      # #5A6A75
    
    # Title Banner
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r_sub = p_title.add_run("GAME UX/UI SPECIFICATION DOCUMENT")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(11)
    r_sub.font.bold = True
    r_sub.font.color.rgb = GOLD
    
    p_main = doc.add_paragraph()
    p_main.paragraph_format.space_after = Pt(6)
    r_m = p_main.add_run("Strand-bezem-escape\n\"Magisch Strand Avontuur\"")
    r_m.font.name = "Calibri"
    r_m.font.size = Pt(24)
    r_m.font.bold = True
    r_m.font.color.rgb = TEAL
    
    p_desc = doc.add_paragraph()
    p_desc.paragraph_format.space_after = Pt(14)
    r_d = p_desc.add_run("Gestandaardiseerde Interface Componenten, Naming Conventions, Functionaliteiten & UX Flow Specificatie")
    r_d.font.name = "Calibri"
    r_d.font.size = Pt(12)
    r_d.font.italic = True
    r_d.font.color.rgb = GRAY

    # Metadata Table
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_table.columns[0].width = Inches(2.0)
    meta_table.columns[1].width = Inches(4.5)
    
    meta_data = [
        ("Projectnaam:", "Strand-bezem-escape (Magisch Strand Avontuur)"),
        ("Document Versie:", "v1.0 (Definitieve UI/UX Standaardisatie)"),
        ("Rol / Auteur:", "Senior Game UX/UI Designer & Technical Product Owner"),
        ("Doelgroep:", "Game Developers, UI/UX Designers, Edu-Tech Content Creators, QA Testers")
    ]
    
    for idx, (label, val) in enumerate(meta_data):
        cell_lbl = meta_table.cell(idx, 0)
        cell_val = meta_table.cell(idx, 1)
        set_cell_background(cell_lbl, "F4F7F6")
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_lbl, top=60, bottom=60, left=100, right=100)
        set_cell_margins(cell_val, top=60, bottom=60, left=100, right=100)
        
        p_l = cell_lbl.paragraphs[0]
        p_l.paragraph_format.space_after = Pt(0)
        r_l = p_l.add_run(label)
        r_l.bold = True
        r_l.font.size = Pt(9.5)
        
        p_v = cell_val.paragraphs[0]
        p_v.paragraph_format.space_after = Pt(0)
        r_v = p_v.add_run(val)
        r_v.font.size = Pt(9.5)

    set_table_borders(meta_table)
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # ---------------------------------------------------------
    # SECTION 1: INLEIDING & DOELSTELLING
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("1. Inleiding & UX Ontwerpprincipes")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(12)
    p_h1.paragraph_format.space_after = Pt(6)
    
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Dit document bevat het officiële User Experience (UX) en User Interface (UI) ontwerpdocument voor "
        "de educatieve game Strand-bezem-escape (commerciële titel: Magisch Strand Avontuur). "
        "Het doel van dit document is het standaardiseren van alle menu's, knoppen, statustellers, "
        "interactiekaarten en feedbackelementen. Door eenduidige naamgeving (naming conventions) en "
        "heldere functionaliteitsomschrijvingen te hanteren, wordt de overdracht naar software-engineers "
        "en gamedesigners gestroomlijnd."
    )
    
    add_callout_box(
        doc,
        [
            "• Kindvriendelijke Ergonomie: Knoppen hebben een minimale touch-target van 48x48dp met duidelijke iconografie.",
            "• Directe Multimodale Feedback: Elk interactief element reageert visueel (schaalverandering/pulse) en auditief (klank/click).",
            "• Hoge Contrasten & Helderheid: Gebruik van speelse, warme strandkleuren met hoge leesbaarheid en duidelijke contours.",
            "• Inclusiviteit & Privacy: Toegankelijkheidsopties zoals rustige beweging en transparante microfoon-permissies."
        ],
        title="KERNPRINCIPES VAN STRAND-BEZEM-ESCAPE UX"
    )

    # ---------------------------------------------------------
    # SECTION 2: UI NAAMGEVING EN DESIGN SYSTEEM STANDAARD
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("2. Gestandaardiseerde UI Naming Conventions")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Om verwarring in de codebase en het design-systeem te voorkomen, hanteren we een gestandaardiseerde "
        "prefix-structuur voor alle UI-onderdelen in de applicatie:"
    )

    prefix_table = doc.add_table(rows=9, cols=3)
    prefix_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    prefix_table.autofit = False
    prefix_table.columns[0].width = Inches(1.5)
    prefix_table.columns[1].width = Inches(1.8)
    prefix_table.columns[2].width = Inches(3.2)
    
    headers = ["Prefix", "Component Type", "Voorbeeld ID"]
    hdr_cells = prefix_table.rows[0].cells
    for i, h_text in enumerate(headers):
        set_cell_background(hdr_cells[i], "0B8457")
        set_cell_margins(hdr_cells[i], top=80, bottom=80, left=100, right=100)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)
        
    prefix_data = [
        ("SCR_", "Scherm / View", "SCR_MAIN_TITLE, SCR_ADVENTURE_SELECT"),
        ("BTN_", "Interactieve Knop", "BTN_PRIMARY_PLAY, BTN_NAV_BACK"),
        ("CARD_", "Selectie- of Informatiekaart", "CARD_GAME_ZEG_ZET, CARD_REWARD_SHOWCASE"),
        ("TOGGLE_", "Aan/Uit Schakelaar", "TOGGLE_AUDIO, TOGGLE_REDUCED_MOTION"),
        ("DSP_", "Weergave / Statusteller", "DSP_STAR_COUNTER, DSP_STICKER_PROGRESS"),
        ("TTL_", "Titel / Header Capsule", "TTL_HEADER_PILL, TTL_SECTION_TITLE"),
        ("INFOBOX_", "Melding / Waarschuwingsvak", "INFOBOX_SPEECH_STATUS, INFOBOX_MIC_BLOCKED"),
        ("DOCK_", "Onderste Actie- / Navigatiebalk", "DOCK_SELECTION_FOOTER, DOCK_REWARD_ACTIONS")
    ]
    
    for row_idx, data in enumerate(prefix_data, start=1):
        row_cells = prefix_table.rows[row_idx].cells
        bg = "F4F7F6" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            set_cell_background(row_cells[col_idx], bg)
            set_cell_margins(row_cells[col_idx], top=60, bottom=60, left=100, right=100)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(prefix_table)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # SECTION 3: SCHERM 1 - HOOFDSCHERM (SCR_MAIN_TITLE)
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("3. Scherm 1: Hoofdscherm / Titelmenu (SCR_MAIN_TITLE)")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Het Hoofdscherm dient als de primaire landingspagina van Magisch Strand Avontuur. "
        "Het zet direct een vrolijke, uitnodigende sfeer neer met het merklogo, het hoofdpersonage "
        "op de vliegende strandbezem, en snelle toegang tot de spelstart en instellingen."
    )

    add_screenshot_figure(doc, img_main, "SCR_MAIN_TITLE - Hoofdscherm / Titelmenu Interface")

    t1 = doc.add_table(rows=8, cols=5)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.autofit = False
    t1.columns[0].width = Inches(1.5)
    t1.columns[1].width = Inches(1.3)
    t1.columns[2].width = Inches(1.6)
    t1.columns[3].width = Inches(1.1)
    t1.columns[4].width = Inches(1.0)
    
    t1_headers = ["Element Code Name", "Visuele Naam", "Functionaliteit & Omschrijving", "Visuele Stijl", "Doel / Actie"]
    for i, h_text in enumerate(t1_headers):
        c = t1.rows[0].cells[i]
        set_cell_background(c, "0B8457")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9)

    s1_data = [
        ("BTN_NAV_BACK", "Terug Knop", "Sluit de game en keert terug naar de overkoepelende app-omgeving.", "Witte cirkel knop met donkere pijl-links", "Navigate Back"),
        ("BTN_AUDIO_TOGGLE_QUICK", "Snelle Audio Knop", "Schakelt audio/geluid direct in of uit vanuit het hoofdscherm.", "Witte cirkel knop met luidspreker-icoon", "Toggle Audio"),
        ("DSP_STAR_COUNTER", "Sterrenteller", "Toont het huidige aantal verzamelde beloningssterren van de speler (bijv. 120).", "Witte capsule pil met gouden rand en ster", "Read Only Display"),
        ("BTN_SETTINGS_GEAR", "Instellingen Knop", "Opent het uitgebreide instellingen- en privacy-menu.", "Gele afgeronde knop met donker tandwiel", "Open SCR_SETTINGS_PRIVACY"),
        ("IMG_GAME_LOGO", "Titel Logo", "Visueel logo 'MAGISCH STRAND AVONTUUR' met 3D-effecten en strandthema.", "Gele/Blauwe 3D typografie met decoratie", "Visual Branding"),
        ("IMG_HERO_CHARACTER", "Mascotte Illustratie", "Hero-illustratie van de jongen op de vliegende strandbezem met de regenboogster.", "Kleurrijke karakter-art op strandachtergrond", "Visual Engagement"),
        ("BTN_PRIMARY_PLAY", "Spelen Knop", "Hoofdactieknop om het spel te starten en het avontuur te kiezen.", "Grote groen-gebolde pilknop met Play-icoon", "Open SCR_ADVENTURE_SELECT")
    ]

    for r_idx, row in enumerate(s1_data, start=1):
        cells = t1.rows[r_idx].cells
        bg = "F4F7F6" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            set_cell_background(cells[c_idx], bg)
            set_cell_margins(cells[c_idx], top=60, bottom=60, left=80, right=80)
            p = cells[c_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(t1)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # SECTION 4: SCHERM 2 - SPEL SELECTIESCHERM (SCR_ADVENTURE_SELECT)
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("4. Scherm 2: Spel Selectiescherm / Kies Avontuur (SCR_ADVENTURE_SELECT)")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "In het Spel Selectiescherm kiest de speler uit drie beschikbare minigames / leermodi. "
        "Elke spelkaart is voorzien van een eigen icoon, titel, korte instructietoelichting en "
        "interactie-indicator."
    )

    add_screenshot_figure(doc, img_select, "SCR_ADVENTURE_SELECT - Spel Selectiescherm Interface")

    t2 = doc.add_table(rows=11, cols=5)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2.autofit = False
    t2.columns[0].width = Inches(1.6)
    t2.columns[1].width = Inches(1.3)
    t2.columns[2].width = Inches(1.7)
    t2.columns[3].width = Inches(1.0)
    t2.columns[4].width = Inches(0.9)
    
    t2_headers = ["Element Code Name", "Visuele Naam", "Functionaliteit & Omschrijving", "Visuele Stijl", "Doel / Actie"]
    for i, h_text in enumerate(t2_headers):
        c = t2.rows[0].cells[i]
        set_cell_background(c, "0B8457")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9)

    s2_data = [
        ("BTN_NAV_BACK", "Terug Knop", "Navigeert terug naar het Hoofdscherm.", "Witte cirkel knop met pijl-links", "Open SCR_MAIN_TITLE"),
        ("TTL_HEADER_PILL", "Header Titel", "Schermtitel capsule met de tekst 'Kies avontuur'.", "Witte afgeronde pill-header", "Static Title"),
        ("DSP_STAR_COUNTER", "Sterrenteller", "Toont actueel aantal verdiende sterren (120).", "Witte capsule pil met ster", "Read Only Display"),
        ("LBL_SECTION_TITLE", "Sectielabel", "Subtitel boven de spellijst: 'Kies spel'.", "Donkergrijze vetgedrukte tekst", "Section Divider"),
        ("CARD_GAME_ZEG_ZET", "Spelkaart: Zeg & Zet", "Selecteert de luister-, spreek- of typ-opdracht minigame. Subtitel: 'Luister, spreek of typ en zet het plaatje op de goede plek.'", "Witte afgeronde kaart met groene rand, spreekwolk-icoon & radio-selectie", "Select Minigame 1"),
        ("CARD_GAME_KIES_WOORD", "Spelkaart: Kies het Woord", "Selecteert de meervoudige keuze minigame. Subtitel: 'Hoor een woord en kies het juiste plaatje.'", "Witte kaart met lichtblauwe rand, boek-icoon & pijl-rechts", "Select Minigame 2"),
        ("CARD_GAME_ZEG_VLIEG", "Spelkaart: Zeg & Vlieg", "Selecteert de spraakgestuurde bezem-vlieggame. Subtitel: 'Vlieg met je stem en zeg het strandwoord.'", "Zachtgele kaart met gouden rand, microfoon/bezem-icoon & pijl-rechts", "Select Minigame 3"),
        ("BTN_PRIMARY_START", "Start Spel Knop", "Start direct de op dat moment geselecteerde minigame.", "Brede groene knop onderaan met Play-icoon", "Launch Active Game"),
        ("BTN_SECONDARY_REWARD", "Beloning Knop", "Navigeert naar het resultatenoverzicht en het stickerboek.", "Creme knop met gele rand en cadeau-icoon", "Open SCR_REWARD_SUMMARY"),
        ("BTN_SECONDARY_OPTIONS", "Opties Knop", "Opent het instellingenmenu voor geluid, hints en devtools.", "Witte knop met blauwe/grijze rand en tandwiel", "Open SCR_SETTINGS_PRIVACY")
    ]

    for r_idx, row in enumerate(s2_data, start=1):
        cells = t2.rows[r_idx].cells
        bg = "F4F7F6" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            set_cell_background(cells[c_idx], bg)
            set_cell_margins(cells[c_idx], top=60, bottom=60, left=80, right=80)
            p = cells[c_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(t2)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # SECTION 5: SCHERM 3 - INSTELLINGEN & PRIVACY (SCR_SETTINGS_PRIVACY)
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("5. Scherm 3: Instellingen & Privacy Menu (SCR_SETTINGS_PRIVACY)")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Het Instellingenscherm biedt volledige controle over de audio, spraakbegeleiding, animatie-intensiteit, "
        "ontwikkelopties (DevTools) en transparante microfoon-toestemmingen voor spraakherkenning."
    )

    add_screenshot_figure(doc, img_settings, "SCR_SETTINGS_PRIVACY - Instellingen & Privacy Interface")

    t3 = doc.add_table(rows=16, cols=5)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    t3.autofit = False
    t3.columns[0].width = Inches(1.7)
    t3.columns[1].width = Inches(1.3)
    t3.columns[2].width = Inches(1.7)
    t3.columns[3].width = Inches(0.9)
    t3.columns[4].width = Inches(0.9)
    
    t3_headers = ["Element Code Name", "Visuele Naam", "Functionaliteit & Omschrijving", "Visuele Stijl", "Doel / Actie"]
    for i, h_text in enumerate(t3_headers):
        c = t3.rows[0].cells[i]
        set_cell_background(c, "0B8457")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9)

    s3_data = [
        ("BTN_NAV_MENU", "Menu Knop", "Sluit het instellingenscherm en keert terug naar de vorige pagina.", "Witte pilknop met pijl-links en tekst 'Menu'", "Return to Sender"),
        ("TTL_HEADER_PILL", "Header Titel", "Schermtitel capsule met de tekst 'Instellingen'.", "Witte afgeronde capsule header", "Static Title"),
        ("TOGGLE_AUDIO", "Audio Schakelaar", "Schakelt gesproken opdrachten en video-audio in/uit. Subtitel: 'Laat opdrachtspraak en video's horen.'", "Witte kaart met luidspreker-icoon en groene Toggle Switch (Aan)", "Toggle Audio State"),
        ("TOGGLE_MUSIC", "Muziek Schakelaar", "Schakelt de achtergrondmuziek in/uit. Subtitel: 'Zachte muziek op de achtergrond.'", "Witte kaart met muzieknoot-icoon en grijze Toggle Switch (Uit)", "Toggle BGM State"),
        ("TOGGLE_HINTS", "Hints Schakelaar", "Schakelt mascottesubsidie en automatische hints in/uit. Subtitel: 'Laat de mascotte helpen wanneer nodig.'", "Witte kaart met lamp-icoon en groene Toggle Switch (Aan)", "Toggle Hint System"),
        ("TOGGLE_REDUCED_MOTION", "Rustige Beweging Toggle", "Vermindert animaties en pulse-effecten voor rustige ervaring. Subtitel: 'Minder beweging en minder pulse-effecten.'", "Witte kaart met oog-kruis icoon en grijze Toggle Switch (Uit)", "Toggle Accessibility"),
        ("TOGGLE_DEVTOOLS", "Zone Editor Toggle", "Opent interactieve zone-locatie editor voor ontwikkelaars. Subtitel: 'Open de interactieve zone-locatie editor.'", "Witte kaart met sleutel-icoon en grijze Toggle Switch (Uit)", "Developer Mode"),
        ("CARD_PRIVACY_SECTION", "Privacy Container", "Gele achtergrondkaart met schild-icoon die alle microfooninformatie bundelt.", "Gele afgeronde container met schild-icoon 'Microfoon en privacy'", "Grouping Container"),
        ("LBL_PRIVACY_DESC", "Privacy Uitleg", "Omschrijving: 'De microfoon wordt alleen gebruikt om korte zinnen naar tekst om te zetten.'", "Donkergrijze tekst onder privacy-titel", "Informational Text"),
        ("DROPDOWN_PRIVACY_FAQ", "FAQ Dropdown", "Uitklapbare knop: 'Waarom gebruiken we de microfoon?' met pijl-omlaag.", "Lichtblauwe pilknop met dropdown pijl", "Toggle FAQ Details"),
        ("INFOBOX_SPEECH_STATUS", "Status Infoblok", "Blauw vak: 'Spraakherkenning is beschikbaar. Als spraak niet werkt op telefoon, typ dezelfde zin.'", "Lichtblauw afgerond vak met telefoon-icoon", "Status Notification"),
        ("INFOBOX_PERMISSION_NOTICE", "Toestemming Infoblok", "Geel vak: 'Deze pagina mag een browser-popup voor microfoontoestemming tonen.'", "Lichtgeel vak met oranje rand", "Permission Alert"),
        ("BTN_MIC_RECHECK", "Controleer Opnieuw Knop", "Herstart de spraakherkenningstest en vraagt opnieuw browser-toestemming.", "Groene brede knop met microfoon-icoon", "Trigger Mic Permission"),
        ("LBL_MIC_INSTRUCTION", "Instructietekst", "Ondersteunende tekst: 'Tik op de knop om microfoontoegang te vragen.'", "Kleine grijze instructietekst", "Instructional Label"),
        ("INFOBOX_MIC_BLOCKED_ALERT", "Geblokkeerd Waarschuwing", "Waarschuwingsvak onderaan: 'Microfoon is geblokkeerd. Zet microfoontoegang aan in de browserinstellingen...'", "Oranje/Rood omrand waarschuwingsvak", "Error State Alert")
    ]

    for r_idx, row in enumerate(s3_data, start=1):
        cells = t3.rows[r_idx].cells
        bg = "F4F7F6" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            set_cell_background(cells[c_idx], bg)
            set_cell_margins(cells[c_idx], top=60, bottom=60, left=80, right=80)
            p = cells[c_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(t3)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # SECTION 6: SCHERM 4 - BELONING & RESULTATEN (SCR_REWARD_SUMMARY)
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("6. Scherm 4: Beloning & Resultaten Scherm (SCR_REWARD_SUMMARY)")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Het Beloningsscherm wordt getoond na het voltooien van een sessie of bij het openen van het stickeroverzicht. "
        "Het geeft gedetailleerde feedback op de geleverde prestatie, verzamelde stickers, geoefende woorden en "
        "verdiende beloningssterren."
    )

    add_screenshot_figure(doc, img_reward, "SCR_REWARD_SUMMARY - Beloning & Resultaten Interface")

    t4 = doc.add_table(rows=16, cols=5)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    t4.autofit = False
    t4.columns[0].width = Inches(1.7)
    t4.columns[1].width = Inches(1.3)
    t4.columns[2].width = Inches(1.7)
    t4.columns[3].width = Inches(0.9)
    t4.columns[4].width = Inches(0.9)
    
    t4_headers = ["Element Code Name", "Visuele Naam", "Functionaliteit & Omschrijving", "Visuele Stijl", "Doel / Actie"]
    for i, h_text in enumerate(t4_headers):
        c = t4.rows[0].cells[i]
        set_cell_background(c, "0B8457")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9)

    s4_data = [
        ("TTL_HEADER_PILL", "Header Titel", "Schermtitel capsule met de tekst 'Beloning'.", "Witte afgeronde capsule header", "Static Title"),
        ("CARD_REWARD_SHOWCASE", "Sticker Showcase Kaart", "Centraal kader dat de verdiende sticker (bijv. Schelp Sticker) en regenboog-ster badge toont.", "Creme achtergrond met gele rand en sticker-illustratie", "Reward Showcase"),
        ("DSP_STICKER_PROGRESS_PILL", "Sticker Voortgangsbadge", "Toont de voortgang van de stickerverzameling (bijv. '0/30' met ster-icoon).", "Gele afgeronde pil met ster-icoon", "Progress Indicator"),
        ("LBL_STICKER_NAME", "Sticker Naam Label", "Tekstlabel onder de stickerweergave: 'Schelp Sticker'.", "Vetgedrukte donkere tekst", "Item Identification"),
        ("STAT_BOX_GOED", "Statistiek: GOED", "Toont het aantal foutloos beantwoorde vragen (bijv. 'GOED: 0').", "Lichtgroene capsule pil met groene rand", "Score Counter"),
        ("STAT_BOX_TEMPO", "Statistiek: TEMPO", "Toont de behaalde snelheidsbonuspuntenscore (bijv. 'TEMPO: +0').", "Lichtblauwe capsule pil met blauwe rand", "Speed Bonus Counter"),
        ("STAT_BOX_HINTS", "Statistiek: HINTS", "Toont het aantal geraadpleegde hints tijdens de sessie (bijv. 'HINTS: 0').", "Lichtoranje capsule pil met oranje rand", "Assist Counter"),
        ("STAT_BOX_AUDIO", "Statistiek: AUDIO", "Toont het aantal keren dat geluid/opdracht is herhaald (bijv. 'AUDIO: 0').", "Witte capsule pil met grijze rand", "Audio Replay Counter"),
        ("STAT_BOX_STERREN", "Statistiek: STERREN", "Toont het totale aantal netto gewonnen beloningssterren (bijv. 'STERREN: +0').", "Zachtgouden capsule pil met gouden rand", "Total Currency Awarded"),
        ("SEC_WORDS_PRACTICED", "Woorden Sectie", "Overzicht van geoefende woorden. Status: 'nog geen woorden' (wanneer leeg).", "Titel met pill-tag 'nog geen woorden'", "Vocabulary Summary"),
        ("SEC_SPATIAL_WORDS", "Plaatswoorden Sectie", "Overzicht van geoefende ruimtelijke plaatswoorden (bijv. 'in', 'op', 'onder'). Status: 'nog geen plaatswoorden'.", "Titel met pill-tag 'nog geen plaatswoorden'", "Grammar/Spatial Summary"),
        ("BANNER_REWARD_SUMMARY", "Beloning Samenvatting", "Onderste trofee-banner: 'Beloning: Schelp Sticker' met trofee-icoon.", "Gele afgeronde banner met trofee-icoon", "Reward Highlight"),
        ("BTN_ACTION_REPLAY", "Opnieuw Knop", "Herstart direct de zojuist gespeelde minigame of sessie.", "Groene capsule knop met herlaad/refresh-icoon en tekst 'Opnieuw'", "Replay Session"),
        ("BTN_ACTION_WORLD", "Wereld Knop", "Navigeert naar de overkoepelende Wereldkaart van Game-Wereld.", "Groene capsule knop met wereldbol-icoon en tekst 'Wereld'", "Open World Map"),
        ("BTN_ACTION_MENU", "Menu Knop", "Navigeert terug naar het Hoofdscherm (SCR_MAIN_TITLE).", "Groene capsule knop met home-icoon en tekst 'Menu'", "Open Main Menu")
    ]

    for r_idx, row in enumerate(s4_data, start=1):
        cells = t4.rows[r_idx].cells
        bg = "F4F7F6" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            set_cell_background(cells[c_idx], bg)
            set_cell_margins(cells[c_idx], top=60, bottom=60, left=80, right=80)
            p = cells[c_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(t4)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ---------------------------------------------------------
    # SECTION 7: INTERACTIE STATE MATRICES & AUDIO FEEDBACK
    # ---------------------------------------------------------
    h1 = doc.add_heading(level=1)
    p_h1 = h1.paragraphs[0] if hasattr(h1, 'paragraphs') else h1
    r = p_h1.add_run("7. Component States & Geluidseffecten Matrix")
    r.font.name = "Calibri"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = TEAL
    p_h1.paragraph_format.space_before = Pt(14)
    p_h1.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    p.add_run(
        "Voor een consistent speelgevoel moeten alle knoppen en interactieve elementen "
        "voldoen aan dezelfde visuele toestandsveranderingen en geluidsfeedback:"
    )

    t5 = doc.add_table(rows=5, cols=4)
    t5.alignment = WD_TABLE_ALIGNMENT.CENTER
    t5.autofit = False
    t5.columns[0].width = Inches(1.5)
    t5.columns[1].width = Inches(1.8)
    t5.columns[2].width = Inches(1.7)
    t5.columns[3].width = Inches(1.5)
    
    t5_headers = ["State Name", "Visuele Transformatie", "Audio Effect (SFX)", "Haptische Feedback"]
    for i, h_text in enumerate(t5_headers):
        c = t5.rows[0].cells[i]
        set_cell_background(c, "0B8457")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9)

    state_data = [
        ("DEFAULT / IDLE", "Normale schaal 1.0x, standaard schaduw en helderheid.", "Geen geluid", "Geen trilling"),
        ("HOVER / FOCUS", "Subtiele vergroting (scale 1.05x), verhoogde schaduw, lichte glow.", "Zachte hoorbare tick / pop", "Geen trilling"),
        ("PRESSED / ACTIVE", "Gekrompen schaal (scale 0.95x), verlaagde schaduw (ingedrukt effect).", "Helder geluidsklik 'btn_click.mp3'", "Lichte haptische tik (5ms)"),
        ("DISABLED / LOCKED", "50% transparantie (opacity 0.5), slot-icoon overlay, geen hover-effect.", "Foutgeluid 'buzz_disabled.mp3'", "Korte dubbele trilling")
    ]

    for r_idx, row in enumerate(state_data, start=1):
        cells = t5.rows[r_idx].cells
        bg = "F4F7F6" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            set_cell_background(cells[c_idx], bg)
            set_cell_margins(cells[c_idx], top=60, bottom=60, left=80, right=80)
            p = cells[c_idx].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = TEAL

    set_table_borders(t5)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Final summary callout
    add_callout_box(
        doc,
        [
            "✓ Dit document is vastgesteld als de officiële UI/UX specificatie voor Strand-bezem-escape.",
            "✓ Alle front-end componenten in de TypeScript/Vite/React codebase moeten worden getagd met de vermelde Code Names.",
            "✓ QA-testen dienen alle schermen en knoppen te valideren aan de hand van de specificatietabellen in hoofdstuk 3 t/m 6."
        ],
        title="ACCEPTATIECRITERIA & QA CHECKLIST",
        border_color="D98310",
        bg_color="FFF8E7"
    )

    output_path = "/Users/melkonian/git/Game-Wereld/docs/UX_Design_Specification_Strand_Bezem_Escape.docx"
    doc.save(output_path)
    print(f"Successfully generated Word document with embedded screenshots at {output_path}")

if __name__ == "__main__":
    build_docx()

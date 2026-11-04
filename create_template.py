import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

with open('canva_products_clean.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Katalog_Telering"

headers = [
    "Brand", "Nama_Produk", "RAM_ROM", "Chipset", 
    "Baterai", "Kamera", "Layar", "Harga_Normal", 
    "Harga_Promo", "Gambar_URL"
]

header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)

thin_border_side = Side(style='thin', color='E2E8F0')
cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

ws.row_dimensions[1].height = 28
for col_num, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col_num, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = header_align
    cell.border = cell_border

regular_font = Font(name="Calibri", size=10)
bold_font = Font(name="Calibri", size=10, bold=True)
price_font = Font(name="Calibri", size=10, bold=True, color="047857")

even_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
odd_fill = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

for row_idx, p in enumerate(products, 2):
    ws.row_dimensions[row_idx].height = 22
    fill = even_fill if row_idx % 2 == 0 else odd_fill

    row_data = [
        p.get("Brand", ""),
        p.get("Nama_Produk", ""),
        p.get("RAM_ROM", ""),
        p.get("Chipset", "-"),
        p.get("Baterai", "-"),
        p.get("Kamera", "-"),
        p.get("Layar", "-"),
        p.get("Harga", 0),
        p.get("Harga", 0),
        p.get("Gambar_URL", "")
    ]

    for col_idx, val in enumerate(row_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=val)
        cell.border = cell_border
        cell.fill = fill

        if col_idx in (8, 9): # Price columns
            cell.font = price_font
            cell.number_format = '"Rp "#,##0'
            cell.alignment = Alignment(horizontal="right", vertical="center")
        elif col_idx in (1, 3): # Brand, RAM
            cell.font = bold_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 2: # Nama
            cell.font = bold_font
            cell.alignment = Alignment(horizontal="left", vertical="center")
        else:
            cell.font = regular_font
            cell.alignment = Alignment(horizontal="left", vertical="center")

# Auto fit columns
for col in ws.columns:
    max_len = 0
    col_letter = get_column_letter(col[0].column)
    for cell in col:
        val_str = str(cell.value or '')
        if len(val_str) > max_len:
            max_len = len(val_str)
    ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 40)

wb.save("Template_Katalog_HP_TELERING.xlsx")
print(f"Template_Katalog_HP_TELERING.xlsx successfully updated with {len(products)} products!")

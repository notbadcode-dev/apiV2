import re
import sys

def format_text(text):
    # 1.- Encapsular "Linting Report:" con un div
    text = re.sub(r"(Linting Report:)", r"<div class='_title'>\1</div>", text)

    # 2.- Capturar "apiV2" y encapsularlo en un div
    text = re.sub(r"> apiV2@1.0.0 lint", r"<div class='_repository'>apiV2</div>", text)

    # 3.- Encapsular la línea del comando eslint en un div
    text = re.sub(r"> \./node_modules/.bin/eslint '\*\*\/\*.ts' --ignore-pattern node_modules/", r"<div class='_script'>npm run lint</div>", text)

    # 4.- Borrar path of runner job
    text = re.sub(r"/home/runner/work/apiV2/apiV2/", r"", text)

    # 5.- Encapsular las líneas de error
    error_lines = re.findall(r"(File:.*?\n\s+Line \d+, Column \d+:.*?@.*?)\n\n", text, re.DOTALL)

    for error_line in error_lines:
        formatted_error_line = re.sub(r"(Line \d+, Column \d+:.*?)\s+(@.*?)", r"<div class='_error'>\1</div><div class='_tag'>\2</div>", error_line)
        formatted_error_line = f"<div class='_file_error'>{formatted_error_line}</div>"
        text = text.replace(error_line, formatted_error_line)

    # 5.- Encapsular summary
    text = re.sub(r"\✖ (\d+) problems \((\d+) errors, (\d+) warnings\)", r"<div class='_summary'>\✖ \1 problems (<div class='_errors'>\2 errors</div>, <div class='_warnings'>\3 warnings</div>)</div>", text)

    # 6.- Encapsular todo en un div _summary
    text = f"<div class='_report'>{text}</div>"

    # 7.- Eliminar saltos de línea vacíos al final
    text = re.sub(r"\n\s*\n", "\n", text)

    return text

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <text>")
    else:
        input_text = sys.argv[1]
        formatted_text = format_text(input_text)

        # Generar archivo HTML
        html_content = f"""\
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style type="text/css">
                    body {{
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 1rem;
                    margin: 0;
                    padding: 0;
                    color: #333;
                    }}
                    body {{
                    padding: 2rem 1rem;
                    font-size: 0.85rem;
                    }}
                    header {{
                    display: flex;
                    align-items: center;
                    }}
                    </style>
                </head>

                <body>
                    {formatted_text}
                </body>
            </html>
            """

        with open("output.html", "w") as html_file:
            html_file.write(html_content)

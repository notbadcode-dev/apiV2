import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

# Configuración del correo electrónico
from_email = 'notbadcode.dev@gmail.com'
to_email = 'notbadcode.dev@gmail.com'
subject = 'Test run'
body = 'Test run'

# Configuración del servidor SMTP de Gmail
smtp_server = 'smtp.gmail.com'
smtp_port = 587
username = 'notbadcode.dev@gmail.com'
password = '6900.$go'

# Generar archivo de texto
filename = 'archivo.txt'
with open(filename, 'w') as f:
    f.write('Este es el contenido del archivo')

# Creación del mensaje
message = MIMEMultipart()
message['From'] = from_email
message['To'] = to_email
message['Subject'] = subject
message.attach(MIMEText(body, 'plain'))

# Adjuntar archivo al correo
with open(filename, 'rb') as f:
    attach = MIMEApplication(f.read(), _subtype='txt')
    attach.add_header('Content-Disposition', 'attachment', filename=filename)
    message.attach(attach)

# Conexión al servidor SMTP y envío del correo
with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.starttls()
    server.login(username, password)
    text = message.as_string()
    server.sendmail(from_email, to_email, text)
    print('Correo electrónico enviado con éxito')

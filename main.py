
from flask import Flask
from flask import render_template
import requests
import json
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import os

#dev
"""
from webdriver_manager.chrome import ChromeDriverManager
"""

from flask import request
from flask import redirect
from flask import url_for

app = Flask(__name__)


def Scrap():
    """self-explanatory"""

    # dev
    """
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    driver = webdriver.Chrome('/usr/lib/chromium-browser/chromedriver', options=chrome_options)
    """

    # Prod
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=chrome_options)
    driver.implicitly_wait(10)

    driver.get("https://www.brou.com.uy/cotizaciones")
    valores = driver.find_elements_by_xpath("//div[@class='linea']//p[@class='valor']")

    #USD
    compra_usd = valores[4].get_attribute("innerHTML")
    venta_usd = valores[5].get_attribute("innerHTML")
    compra_usd = float(compra_usd.replace(',','.'))
    venta_usd = float(venta_usd.replace(',','.'))
    interbancario_usd = round(((compra_usd + venta_usd) / 2), 2)
    compra_usd = round(compra_usd, 2)
    venta_usd = round(venta_usd, 2)
    compra_usd = format(compra_usd, '.2f')
    venta_usd = format(venta_usd, '.2f')
    interbancario_usd = float(format(interbancario_usd, '.2f'))

    #EUR
    compra_eur = valores[8].get_attribute("innerHTML")
    venta_eur = valores[9].get_attribute("innerHTML")
    compra_eur = float(compra_eur.replace(',','.'))
    venta_eur = float(venta_eur.replace(',','.'))
    interbancario_eur = float((compra_eur + venta_eur) / 2)

    #ARG
    compra_arg = valores[12].get_attribute("innerHTML")
    venta_arg = valores[13].get_attribute("innerHTML")
    compra_arg = float(compra_arg.replace(',','.'))
    venta_arg = float(venta_arg.replace(',','.'))
    interbancario_arg = float((compra_arg + venta_arg) / 2)

    #REAL
    compra_real = valores[16].get_attribute("innerHTML")
    venta_real = valores[17].get_attribute("innerHTML")
    compra_real = float(compra_real.replace(',','.'))
    venta_real = float(venta_real.replace(',','.'))
    interbancario_real = float((compra_real + venta_real) / 2)

    driver.quit()
    return compra_usd, venta_usd, interbancario_usd, compra_eur, venta_eur, interbancario_eur, compra_arg, venta_arg, interbancario_arg, compra_real, venta_real, interbancario_real

cache = Scrap()


@app.route('/', methods=['GET', 'POST'])
def Index():
    if request.method == 'GET':
        return render_template('index.html', compra_usd=cache[0],
                            venta_usd=cache[1], interbancario_usd=cache[2])
    """
    if request.method == 'POST':
        valor_a_convertir = request.form['valor-a-convertir']
        valor_a_convertir = int(valor)

        moneda_base = request.form['moneda-base']
        moneda_conversion = request.form['moneda-conversion']
        operacion = request.form['operacion']

        return render_template('index.html', compra_usd=cache[4],
                        venta_usd=cache[5], interbancario_usd=interbancarios[0],
                        total=total, total_cambios=total_cambios, ganas=ganas)
    """

# prod
if __name__ == '__main__':
    app.run(threaded=True, port=5000)

# dev
"""
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
"""
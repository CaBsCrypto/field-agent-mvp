# Manual Técnico de Operación: Básculas SIRAGA & Protocolo de Hermeticidad (Fuga C3 Abastible)

## Resumen Ejecutivo
Este documento técnico contiene el procedimiento operativo real de Básculas de Llenado SIRAGA (GLP), la secuencia de comprobación de Hermeticidad, la guía paso a paso de verificación de sensores y la Secuencia de Fallas asociadas a la fuga C3 en carrusel de llenado de cilindros.

---

## 1. Principio de Funcionamiento de Básculas SIRAGA & Hermeticidad

1. **Posicionamiento:** El cilindro de GLP se posiciona en la romana de llenado.
2. **Detección PLC:** El PLC detecta la presencia del cilindro en el interior de la romana mediante la celda de carga (requiere un peso registrado mayor a 5 kg).
3. **Señal Eléctrica VAL1:** El PLC envía una señal eléctrica a la válvula VAL1, activando los siguientes actuadores:
   - **Cilindro Neumático 1C:** Centra el cilindro de GLP en la romana de llenado.
   - **Cilindro Neumático 1D:** Posiciona la cabeza de llenado en la válvula del cilindro de gas.
4. **Prueba de Hermeticidad (Presostato 27):**  
   - Se genera una presión neumática con la finalidad de asegurar la estanqueidad y corroborar la hermeticidad en la cabeza de llenado por una posible fuga.
   - La estanqueidad es confirmada e indicada al PLC por el Presostato 27.
5. **Señal Eléctrica VAL2 (Llenado):**  
   - Estando dadas las 3 condiciones anteriores (Celda de carga > 5kg + Centrado 1C + Presión de estanqueidad en Presostato 27), el PLC envía una señal eléctrica a la válvula VAL2.
   - La electroválvula VAL2 conmuta y envía señal de aire a la válvula de corte de GLP (1A) y simultáneamente a la cabeza de llenado 162, iniciando el llenado del cilindro.
6. **Cierre de Llenado & Eyección (VAL3):**  
   - Al completar el peso de GLP, el PLC corta las señales eléctricas aplicadas a VAL1 y VAL2.
   - El cilindro queda a la espera de una señal magnética a 1 metro de la salida del carrusel. Esta señal indica al PLC que revise las condiciones de VAL1 y VAL2.
   - Al recibir la segunda señal magnética a 50 cm de la salida del carrusel, el PLC activa la válvula VAL3, enviando aire al cilindro neumático 1B, el cual eyecta el cilindro de GLP hacia la cadena transportadora rumbo a la romana de control de peso.

---

## 2. Guía Paso a Paso: Acceso a Revisión de Hermeticidad (Cabezal SIRAGA)

Para realizar la comprobación y verificación del sistema de hermeticidad del cabezal Siraga en pantalla PLC:

1. **Bloqueo Preventivo:** Bloquear la alimentación de GLP con el dispositivo específico de seguridad.
2. **Navegación en Menú PLC:**
   - Presionar tecla F3 y presionar ENTER.
   - Ingresar el código técnico: 01024 y presionar ENTER.
   - Presionar F3 reiteradamente hasta llegar al menú GENERAL y presionar ENTER.
   - Seleccionar PLC y presionar ENTER.
   - Seleccionar STEP BY STEP y presionar ENTER.
   - Dirigirse con la tecla F3 hasta SFC, cambiar el valor de 0 a 1 y presionar ENTER.
   - Presionando F2 se puede avanzar paso a paso.
3. **Verificación de Sensores:**
   - Salir del programa y en el menú principal presionar la combinación SHIFT + ESC para desplegar los sensores en pantalla.
   - Al bajar el cabezal de llenado, proceder con la desconexión del tubing de aire del cabezal.
   - Bloquear con el dedo el tubing de aire: el sensor debe cambiar su estado en pantalla de 1 a 0, y al soltarlo debe cambiar de 0 a 1.
   - Diagnóstico de Falla: Si esta condición de cambio de estado 1 -> 0 / 0 -> 1 no se cumple, significa que el Presostato 27 no está trabajando de forma correcta.

---

## 3. Secuencia de Fallas & Análisis de Incidente (Fuga C3)

El análisis del incidente registra una cadena de 3 fallas secuenciales:

1. **Falla 1: Sistema de Hermeticidad**  
   - Análisis: Si el sistema de hermeticidad hubiese actuado correctamente (detectando la falta de estanqueidad en Presostato 27), el cabezal NO debería haber comenzado a llenar.
2. **Falla 2: Válvula de Corte GLP (1A)**  
   - Análisis: Al presionar la Parada de Emergencia, la válvula de corte de GLP debió haber cerrado de inmediato.
3. **Falla 3: Válvula Mecánica de Actuador Anillo de Carrusel**  
   - Análisis: Al presionar la Parada de Emergencia, el actuador neumático debió haber cerrado impidiendo la liberación o escape del fluido C3.

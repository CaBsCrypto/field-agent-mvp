# Manual de Códigos de Error — Equipos HVAC

**Versión:** 3.2 | **Última actualización:** Agosto 2026  
**Aplica a:** Equipos de climatización y refrigeración industrial (Split, VRF, Chiller, Roof Top)  
**Empresa:** ServiClima Industrial S.A. — Departamento Técnico

---

## Instrucciones de Uso

Antes de consultar este manual, asegúrese de:
1. Anotar el código de error completo tal como aparece en la pantalla del equipo
2. Registrar el modelo y número de serie del equipo
3. Verificar si el error es nuevo o recurrente (consultar historial de servicio si está disponible)
4. Tener el multímetro y manómetros disponibles antes de iniciar diagnóstico

> **⚠️ ADVERTENCIA:** Ante cualquier error con indicación de "PELIGRO ELÉCTRICO" o fuga visible de refrigerante, DETENGA el equipo inmediatamente y escale al supervisor antes de proceder.

---

## Tabla de Códigos de Error

### GRUPO E: Errores de Sensor y Temperatura

---

#### E-01 — Falla Sensor Temperatura Ambiente (Interior)

| Campo | Detalle |
|-------|---------|
| **Descripción** | El sensor NTC de temperatura de retorno de aire interior reporta valor fuera de rango o circuito abierto |
| **Rango normal** | -20°C a +60°C (resistencia 10kΩ a 25°C) |
| **Frecuencia** | Muy común, especialmente en equipos > 5 años |

**Causas Probables:**
- Sensor NTC dañado por humedad o corrosión
- Cable del sensor cortado o con mala conexión en tarjeta de control
- Tarjeta de control con falla en circuito de lectura analógica

**Solución Paso a Paso:**
1. Desconectar alimentación eléctrica del equipo (cortar breaker)
2. Acceder al compartimiento del sensor en la unidad interior (panel frontal)
3. Desconectar el conector del sensor de la tarjeta de control
4. Medir resistencia del sensor con multímetro: debe ser ~10kΩ a temperatura ambiente (25°C)
5. Si resistencia es OL (circuito abierto) o 0Ω (cortocircuito) → **Reemplazar sensor** (código de repuesto: NTC-10K-B3950)
6. Si resistencia es correcta: verificar continuidad del cableado entre sensor y tarjeta
7. Limpiar conector con spray limpiador de contactos
8. Reconectar y energizar. Verificar que el error se limpie
9. Registrar reemplazo en planilla de servicio

**Cuándo Escalar:**
- Si el error persiste después de reemplazar sensor y verificar cableado → posible falla en tarjeta de control. Escalar al supervisor técnico.

---

#### E-02 — Falla Sensor Temperatura Serpentín Evaporador

| Campo | Detalle |
|-------|---------|
| **Descripción** | Sensor de temperatura del serpentín del evaporador fuera de rango |
| **Rango normal** | -20°C a +50°C |

**Causas Probables:**
- Sensor desprendido del serpentín (pérdida de contacto físico)
- Cable dañado por rozamiento con partes móviles
- Sensor NTC defectuoso por congelamiento reiterado

**Solución Paso a Paso:**
1. Apagar equipo y cortar suministro eléctrico
2. Acceder al serpentín del evaporador
3. Verificar que el sensor esté firmemente sujeto al tubo del serpentín con su clip metálico
4. Asegurar que haya buen contacto térmico (el bulbo debe tocar directamente el tubo de cobre)
5. Si el clip está roto → usar cinta de aluminio para fijar temporalmente + ordenar clip de repuesto
6. Medir resistencia del sensor: debe variar con la temperatura
7. Verificar cableado hasta la tarjeta de control
8. Energizar y verificar desaparición del error
9. Si el equipo muestra congelamiento recurrente del serpentín, revisar carga de refrigerante (ver E-11)

**Cuándo Escalar:**
- Si el serpentín está congelado en forma severa o hay acumulación excesiva de hielo → Escalar.

---

#### E-03 — Falla Sensor Temperatura Serpentín Condensador

**Descripción:** Sensor NTC del serpentín del condensador (unidad exterior) reporta falla.

**Causas Probables:**
- Sensor dañado por exposición a alta temperatura
- Cable pelado por UV o rozamiento
- Conector con oxidación en bornes

**Solución Paso a Paso:**
1. Apagar equipo. Precaución: la unidad exterior puede estar muy caliente
2. Esperar 10 minutos para que el serpentín enfríe antes de manipular
3. Acceder al sensor ubicado en el serpentín del condensador (tubo de cobre de salida)
4. Verificar sujeción y contacto del sensor
5. Medir resistencia: a 40°C debe ser aprox. 5.9kΩ
6. Verificar continuidad del cable hasta tarjeta PCB exterior
7. Limpiar conectores y reemplazar sensor si es necesario

---

#### E-04 — Falla Sensor Temperatura de Descarga del Compresor

| Campo | Detalle |
|-------|---------|
| **Descripción** | Temperatura de descarga del compresor supera el límite de seguridad (generalmente >125°C) o sensor con falla |
| **Nivel de criticidad** | ⚠️ **ALTO** — puede indicar condición de daño inminente al compresor |

**Causas Probables:**
- Temperatura de descarga genuinamente alta (sobrecalentamiento real):
  - Nivel bajo de refrigerante
  - Filtro secador tapado
  - Válvula de expansión defectuosa
- Sensor de descarga defectuoso o mal instalado

**Solución Paso a Paso:**
1. **NO reiniciar el equipo si hay calor excesivo visible o olor a quemado**
2. Verificar presiones de operación con manómetros
3. Presión de alta lado del compresor: dentro de rango operativo según tabla de presiones del refrigerante usado
4. Si presiones son normales → medir temperatura real de descarga con termómetro de contacto
5. Si temperatura real es normal pero sensor reporta error → reemplazar sensor de descarga
6. Si temperatura real es alta → revisar carga de refrigerante, filtro secador y válvula de expansión

**Cuándo Escalar:**
- Si temperatura de descarga real supera 130°C → **ESCALAR INMEDIATAMENTE**. No operar el equipo.
- Si hay olor a quemado → **ESCALAR INMEDIATAMENTE**.

---

#### E-05 — Falla Sensor de Presión Alta (Presostato Alta Presión)

**Descripción:** El presostato de alta presión ha actuado o el sensor de presión reporta valor fuera de rango.

**Causas Probables:**
- Alta presión real por condensador sucio
- Temperatura ambiente exterior muy elevada
- Ventilador del condensador detenido (ver E-21)
- Carga excesiva de refrigerante
- Presostato defectuoso

**Solución Paso a Paso:**
1. Verificar si el ventilador del condensador está girando normalmente
2. Inspeccionar visualmente el serpentín del condensador: ¿está sucio/tapado?
3. Si condensador sucio → limpiar con agua a presión moderada (no directo a los componentes eléctricos)
4. Medir presión de alta con manómetro: comparar con tabla de presiones para la temperatura ambiente actual
5. Si presión es genuinamente alta → investigar causa (ver puntos anteriores)
6. Si presostato actuó por seguridad: una vez resuelto el problema, resetear manualmente (botón en el presostato)

---

### GRUPO P: Errores de Presión de Refrigerante

---

#### E-10 — Presión Baja de Refrigerante (Baja Presión)

| Campo | Detalle |
|-------|---------|
| **Descripción** | La presión en el lado de baja del sistema es menor a la presión mínima de operación |
| **Nivel de criticidad** | ⚠️ **MEDIO-ALTO** — posible fuga de refrigerante |

**Causas Probables:**
- Fuga de refrigerante en sistema (revisar juntas, válvulas, conexiones)
- Filtro secador tapado (caída de presión excesiva)
- Válvula de servicio cerrada accidentalmente
- Temperatura ambiente exterior muy baja (operación fuera de rango)
- Sensor de baja presión defectuoso

**Solución Paso a Paso:**
1. Verificar que todas las válvulas de servicio estén abiertas (anti-horario hasta tope)
2. Revisar temperatura ambiente exterior: ¿está dentro del rango de operación del equipo?
3. Conectar manómetros y registrar presión de baja
4. Comparar con presión de saturación esperada para la temperatura de evaporación actual
5. Si presión es muy baja → inspeccionar sistema por fugas con detector de gas o agua jabonosa
6. Verificar estado del filtro secador (diferencial de temperatura < 2°C = bien; > 5°C = probable tapado)
7. Si se detecta fuga → **No cargar refrigerante sin reparar la fuga primero**

**Cuándo Escalar:**
- Si se detecta fuga de refrigerante → **ESCALAR al supervisor** antes de cualquier recarga.
- Si el equipo tiene R-22 → escalar siempre (refrigerante regulado).

---

#### E-11 — Nivel Bajo de Refrigerante (Carga Insuficiente)

**Descripción:** El sistema detecta operación con carga de refrigerante por debajo del nivel óptimo, sin activar el presostato de baja presión aún.

**Síntomas adicionales:** Serpentín del evaporador con escarcha parcial, alto sobrecalentamiento (superheat), temperatura de descarga elevada.

**Causas Probables:**
- Pérdida gradual por fuga pequeña no detectada
- Carga incorrecta en servicio anterior

**Solución Paso a Paso:**
1. Conectar manómetros en puertos de servicio (alta y baja)
2. Medir sobrecalentamiento (superheat): temperatura de vapor en succión − temperatura de saturación a esa presión
   - Superheat normal: 5-8°C (residencial), 8-15°C (industrial)
   - Superheat > 15°C indica carga insuficiente
3. Si se confirma carga baja → **buscar y reparar fuga ANTES de cargar**
4. Solo si no hay fuga detectable: completar carga con refrigerante correcto según especificación del equipo
5. Verificar subcooling en la línea de líquido (debe ser 5-10°C)
6. Registrar cantidad cargada en kg en la planilla de servicio

**Cuándo Escalar:**
- Siempre que se vaya a manipular refrigerante → notificar al supervisor y tener certificación vigente.

---

#### E-12 — Alta Presión de Refrigerante (Crítica)

**Descripción:** La presión de alta supera el límite de corte por seguridad del presostato de alta.

**Causas Probables:**
- Condensador completamente bloqueado (suciedad, objetos, vegetación)
- Ventilador condensador sin funcionar
- Sobrecarga de refrigerante
- Temperatura ambiente extrema

**Solución Paso a Paso:**
1. Apagar el equipo inmediatamente si el compresor no se detuvo solo
2. Identificar y eliminar la causa del bloqueo
3. Esperar que el sistema baje la presión antes de reiniciar
4. Si ventilador no funciona → revisar capacitor, motor, y conexiones (ver E-21)
5. Si hay sobrecarga de refrigerante → recuperar refrigerante excedente con equipo certificado

**Cuándo Escalar:**
- Si no se puede identificar la causa del aumento de presión → Escalar.

---

### GRUPO C: Errores de Compresor

---

#### E-20 — Protección Térmica del Compresor Activada

| Campo | Detalle |
|-------|---------|
| **Descripción** | El termostato interno del compresor (klixon) se abrió por sobretemperatura |
| **Nivel de criticidad** | ⚠️ **ALTO** |

**Causas Probables:**
- Operación prolongada en condiciones extremas
- Voltaje bajo o desequilibrio de fase (equipos trifásicos)
- Compresor en proceso de falla mecánica interna
- Aceite de compresor degradado o contaminado

**Solución Paso a Paso:**
1. Apagar el equipo y cortar alimentación eléctrica
2. Esperar MÍNIMO 30 minutos para que el klixon se enfríe y resetee
3. Medir voltaje en bornes del compresor con el equipo detenido
4. En trifásico: verificar desequilibrio de fases (máximo 2% de diferencia)
5. Verificar amperaje al arranque y en régimen (comparar con placa del equipo)
6. Si la protección térmica actúa repetidamente → el compresor puede estar en proceso de falla

**Cuándo Escalar:**
- Si la protección actúa más de 2 veces en el mismo día → **ESCALAR al supervisor**.
- Si el compresor no arranca tras el reseteo (zumba y corta) → **ESCALAR**.

---

#### E-21 — Falla Ventilador Condensador

**Descripción:** El motor del ventilador del condensador (unidad exterior) no opera o gira a velocidad anormal.

**Causas Probables:**
- Capacitor de arranque/marcha defectuoso
- Motor ventilador quemado
- Obstrucción en el aspa (suciedad, objeto extraño)
- Falla en la tarjeta de control (señal de control)

**Solución Paso a Paso:**
1. Apagar el equipo. Verificar que el aspa no tenga obstrucciones físicas
2. Hacer girar el aspa manualmente: debe girar libre sin resistencia
3. Medir capacitor con capacímetro: comparar con valor en placa (tolerancia ±5%)
4. Si capacitor está fuera de rango → **reemplazar capacitor**
5. Si capacitor está bien: medir resistencia de los bobinados del motor (R-C, R-S, C-S)
6. Si bobinados abiertos o en cortocircuito → **reemplazar motor ventilador**
7. Si motor y capacitor están bien → verificar señal de control desde tarjeta PCB

---

#### E-22 — Corriente Alta del Compresor (Sobrecorriente)

**Descripción:** La corriente del compresor supera el valor nominal en placa.

**Causas Probables:**
- Voltaje de alimentación bajo (< 10% del nominal)
- Compresor con desgaste mecánico interno
- Contaminación del aceite o del sistema
- Alta presión de descarga (ver E-12)

**Solución Paso a Paso:**
1. Medir voltaje de alimentación en bornes del compresor (en operación)
2. Verificar que el voltaje esté dentro del ±10% del valor nominal de la placa
3. Medir amperaje en cada fase con pinza amperimétrica
4. Comparar con corriente nominal y máxima de la placa del equipo
5. Si voltaje es correcto y corriente alta → verificar presión de descarga
6. Si todas las condiciones son normales pero corriente sigue alta → compresor con desgaste interno

**Cuándo Escalar:**
- Si corriente supera en >20% el valor nominal → **ESCALAR**.

---

#### E-23 — Falla en Arranque del Compresor

**Descripción:** El compresor no arranca en los intentos de encendido.

**Causas Probables:**
- Capacitor de arranque defectuoso (equipos monofásicos)
- Voltaje insuficiente
- Compresor bloqueado mecánicamente (líquido en cárter)
- Protección térmica activa (ver E-20)

**Solución Paso a Paso:**
1. Verificar que la protección térmica esté reseteada (esperar 30 min y probar)
2. Medir voltaje de alimentación
3. En equipos monofásicos: reemplazar capacitor de arranque si está fuera de especificación
4. Si el compresor fue apagado durante mucho tiempo en ambiente frío: puede haber líquido refrigerante en el cárter
   - Activar resistencia de cárter si el equipo la tiene (o esperar 4-6 horas antes de arrancar)
5. Intentar arrancar sin carga (válvulas de servicio entrecerradas) para verificar si es problema mecánico

**Cuándo Escalar:**
- Si el compresor no arranca después de verificar todos los puntos → **ESCALAR**.

---

### GRUPO T: Errores de Tarjeta de Control

---

#### E-30 — Falla Comunicación Unidad Interior — Exterior

| Campo | Detalle |
|-------|---------|
| **Descripción** | Se perdió la comunicación entre la tarjeta de control de la unidad interior y la unidad exterior |
| **Frecuencia** | Común en instalaciones con cableado de comunicación de baja calidad |

**Causas Probables:**
- Cable de comunicación (señal) dañado, cortado o con mala conexión
- Interferencia electromagnética en el cableado de señal
- Tarjeta de control interior o exterior con falla
- Polaridad invertida en el cable de comunicación

**Solución Paso a Paso:**
1. Verificar conexión del cable de comunicación en ambos extremos (unidad interior y exterior)
2. El cableado de señal generalmente usa bornera de 3 hilos: A, B y tierra
3. Verificar que la polaridad sea correcta (A con A, B con B)
4. Medir voltaje en el cable de comunicación (generalmente hay señal DC entre 5-12V)
5. Verificar visualmente el cable en toda su longitud buscando daños físicos
6. Si el cable tiene > 50m: verificar que el calibre sea adecuado (mínimo 0.75mm²)
7. Reemplazar cable si hay daño o sospecha de interferencia

**Cuándo Escalar:**
- Si el error persiste con cable nuevo y conexiones correctas → posible falla de tarjeta PCB. Escalar.

---

#### E-31 — Falla Tarjeta de Control Principal

**Descripción:** La tarjeta de control principal (PCB) ha detectado un error interno o de autochequeo.

**Causas Probables:**
- Voltaje de alimentación de la tarjeta fuera de especificación
- Condensadores de la tarjeta deteriorados (especialmente en equipos > 8 años)
- Daño por sobretensión (rayos, variaciones de red)
- Firmware corrupto

**Solución Paso a Paso:**
1. Apagar el equipo completamente y esperar 5 minutos
2. Verificar voltaje de alimentación de la tarjeta (generalmente 12V o 24V DC desde la fuente de poder)
3. Inspeccionar visualmente la tarjeta: ¿hay condensadores abombados, quemaduras, rastros de humedad?
4. Si hay daño visible → no intentar reparar en terreno, reemplazar la tarjeta
5. Si no hay daño visible: resetear la tarjeta (borrar configuración y reconfigurar según manual del modelo)

**Cuándo Escalar:**
- Reemplazo de tarjeta PCB **SIEMPRE requiere notificación al supervisor** para autorización de repuesto.

---

#### E-32 — Error de EEPROM / Configuración Corrupta

**Descripción:** Los parámetros de configuración almacenados en la memoria EEPROM de la tarjeta están corruptos o son inválidos.

**Solución Paso a Paso:**
1. Acceder al menú de servicio del equipo (combinación de botones según modelo — ver manual del modelo específico)
2. Realizar reset de fábrica de parámetros
3. Reprogramar los parámetros de instalación: dirección del equipo, tipo de refrigerante, capacidad, etc.
4. Verificar operación normal tras la reconfiguración

---

### GRUPO V: Errores del Sistema de Ventilación

---

#### E-40 — Falla Motor Ventilador Evaporador

**Descripción:** El motor del ventilador de la unidad interior no opera o velocidad incorrecta.

**Causas Probables:**
- Motor de inducción con bobinado quemado
- Capacitor defectuoso (en motores monofásicos)
- En motores DC (Inverter): módulo driver defectuoso
- Rodamiento trabado

**Solución Paso a Paso:**
1. Verificar si el motor tiene capacitor: medir con capacímetro
2. Intentar girar el rotor manualmente (con equipo apagado): debe girar libremente
3. Medir resistencia de bobinados: comparar entre fases (deben ser iguales)
4. En motores DC Inverter: verificar voltaje de bus DC y señal PWM de control

**Cuándo Escalar:**
- Si el motor requiere reemplazo en unidad empotrada o con difícil acceso → coordinar con supervisor para planificar parada del sistema.

---

#### E-41 — Velocidad del Ventilador Fuera de Rango

**Descripción:** El control detecta que la velocidad del ventilador no corresponde a la velocidad comandada.

**Causas Probables:**
- Rotor sucio con desequilibrio de masa
- Aspa dañada o deformada
- Rodamientos con desgaste
- Sensor de velocidad (Hall) defectuoso

**Solución Paso a Paso:**
1. Inspeccionar aspa del ventilador: limpiar suciedad acumulada en paletas
2. Verificar que el aspa esté correctamente centrada y sin deformaciones
3. Con el equipo operando: medir RPM con tacómetro óptico y comparar con especificación
4. Revisar estado de los rodamientos (sonido de roce o vibración excesiva)
5. Si hay sensor Hall: verificar señal con oscilóscopo o multímetro en modo frecuencia

---

### GRUPO I: Errores de Inverter y Electrónica de Potencia

---

#### E-50 — Falla Módulo Inverter (IGBT)

| Campo | Detalle |
|-------|---------|
| **Descripción** | El módulo de potencia del variador de frecuencia (IGBT) ha detectado una condición de falla |
| **Nivel de criticidad** | ⚠️ **ALTO** — componente de alto costo |

**Causas Probables:**
- Sobrecalentamiento del módulo IGBT (disipador sucio, pasta térmica seca)
- Cortocircuito en el bobinado del compresor
- Voltaje de bus DC excesivo por sobretensión en la red
- Módulo IGBT dañado

**Solución Paso a Paso:**
1. Apagar el equipo y esperar 10 minutos (capacitores del bus DC)
2. Verificar que el disipador del módulo IGBT esté limpio y con buena pasta térmica
3. Medir resistencia entre terminales del compresor (U-V, V-W, U-W): deben ser iguales
4. Si hay asimetría en bobinados → el compresor puede estar dañando el IGBT. Escalar.
5. Verificar voltaje de alimentación de red: ¿hay sobretensiones o variaciones?
6. Inspeccionar visualmente el módulo: quemaduras, grietas en encapsulado

**Cuándo Escalar:**
- **Siempre** que el módulo IGBT requiera reemplazo → Escalar al supervisor (repuesto de alto costo).

---

#### E-51 — Error de Voltaje Bus DC

**Descripción:** El voltaje del bus de corriente continua del inverter está fuera del rango de operación.

**Causas Probables:**
- Tensión de red muy alta o muy baja
- Rectificador de entrada defectuoso
- Capacitores de filtro del bus DC degradados

**Solución Paso a Paso:**
1. Medir voltaje de alimentación en la acometida del equipo
2. Para redes 220V: el voltaje de bus DC debe ser aprox. 310V
3. Para redes 380V trifásico: el voltaje de bus DC debe ser aprox. 537V
4. Si la red está en rango y el bus DC es incorrecto → falla interna del inverter
5. **No intentar medir el bus DC sin EPP adecuado** (guantes de alta tensión)

**Cuándo Escalar:**
- Cualquier intervención en el bus DC o el inverter → **Escalar obligatoriamente**.

---

### GRUPO F: Errores de Filtro y Sistema

---

#### E-60 — Filtro de Aire Sucio (Recordatorio de Mantenimiento)

**Descripción:** El equipo ha contado las horas de operación y solicita limpieza del filtro de aire.

**Nota:** Este es un recordatorio de mantenimiento, NO una falla de componente.

**Solución Paso a Paso:**
1. Retirar el panel frontal de la unidad interior
2. Extraer el filtro de aire (generalmente sujeto con clips)
3. Limpiar con aspiradora y agua tibia (NO usar detergentes agresivos)
4. Secar completamente antes de reinstalar (NUNCA reinstalar húmedo)
5. Reinstalar filtro y panel
6. Resetear el contador de horas de filtro: mantenga presionado el botón "CLEAN" por 5 segundos (varía según modelo)

---

#### E-61 — Protección Anti-Congelamiento del Evaporador

**Descripción:** La temperatura del serpentín del evaporador bajó por debajo del punto de congelamiento del agua. El equipo reduce o detiene la operación para evitar daño.

**Causas Probables:**
- Caudal de aire insuficiente (filtro sucio, ventilador lento, conductos tapados)
- Temperatura de consigna demasiado baja para las condiciones
- Carga insuficiente de refrigerante (ver E-11)

**Solución Paso a Paso:**
1. Verificar estado del filtro de aire (ver E-60)
2. Verificar que todos los registros de aire estén abiertos
3. Esperar que el hielo se descongele antes de reiniciar (puede tomar 30-60 minutos)
4. Ajustar el setpoint de temperatura a un valor más moderado
5. Si el congelamiento es recurrente con filtro limpio → verificar carga de refrigerante

---

#### E-70 — Falla en Protección de Flujo de Agua (Chiller / Fan Coil con agua helada)

**Descripción:** El presostato o flujóstato de agua indica ausencia o insuficiencia de flujo de agua en el evaporador del chiller o en la bobina de fan coil.

**Causas Probables:**
- Bomba de agua detenida o defectuosa
- Válvula de corte cerrada
- Filtro de agua colmatado
- Aire en el circuito hidráulico

**Solución Paso a Paso:**
1. Verificar que la bomba de agua esté operativa (escuchar sonido, verificar LED de estado)
2. Verificar que todas las válvulas manuales del circuito estén abiertas
3. Revisar filtro de agua (Y-strainer): limpiar si está tapado
4. Purgar el aire del circuito hidráulico desde las válvulas de purga
5. Verificar presión del sistema hidráulico (debe estar dentro del rango de diseño)

**Cuándo Escalar:**
- Si la bomba no opera o hay fuga de agua → **Escalar**.

---

#### E-80 — Falla General / Código No Reconocido

**Descripción:** El equipo muestra un código de error no contemplado en este manual.

**Solución Paso a Paso:**
1. Anotar el código exacto tal como aparece en la pantalla
2. Anotar el modelo del equipo y el número de serie
3. Consultar el manual específico del fabricante (disponible en la carpeta compartida de la empresa)
4. Si no se encuentra información → **Escalar al supervisor** con la información del equipo y el código

---

## Tabla Resumen de Criticidad

| Código | Descripción Corta | Criticidad | Escalar |
|--------|------------------|-----------|---------|
| E-01 | Sensor T° ambiente interior | Baja | Solo si persiste |
| E-02 | Sensor T° serpentín evap. | Baja | Solo si congelado |
| E-03 | Sensor T° serpentín cond. | Baja | Raramente |
| E-04 | Sensor T° descarga compresor | **Alta** | Si T° real > 130°C |
| E-05 | Presostato alta presión | Media | Si causa no identificada |
| E-10 | Baja presión refrigerante | **Alta** | Si hay fuga confirmada |
| E-11 | Nivel bajo refrigerante | Media | Siempre antes de cargar |
| E-12 | Alta presión crítica | **Alta** | Si causa no identificada |
| E-20 | Protección térmica compresor | **Alta** | Si actúa >2 veces/día |
| E-21 | Falla ventilador condensador | Media | Si requiere reemplazo motor |
| E-22 | Sobrecorriente compresor | **Alta** | Si >20% nominal |
| E-23 | Falla arranque compresor | **Alta** | Si no arranca tras diagnóstico |
| E-30 | Falla comunicación int-ext | Media | Si persiste con cable nuevo |
| E-31 | Falla tarjeta control | **Alta** | Para reemplazar PCB |
| E-32 | EEPROM corrupta | Media | Si reset no soluciona |
| E-40 | Falla motor ventilador evap. | Media | Si requiere reemplazo |
| E-41 | Velocidad ventilador fuera rango | Baja | Si persiste tras limpieza |
| E-50 | Falla módulo IGBT | **Alta** | **Siempre** |
| E-51 | Error voltaje bus DC | **Alta** | **Siempre** |
| E-60 | Filtro sucio (mantenimiento) | Informativo | No |
| E-61 | Anti-congelamiento evaporador | Media | Si recurrente |
| E-70 | Falla flujo agua | Media-Alta | Si bomba detenida |
| E-80 | Código no reconocido | Desconocida | **Siempre** |

---

## Notas para el Técnico

- **Siempre registra** el código de error, fecha, hora, modelo y serie del equipo en la planilla de servicio
- **Nunca reinicies** un equipo sin identificar la causa del error (puede agravar el daño)
- **Fotografía** el display con el código de error antes de resetear
- **Consulta al supervisor** si tienes dudas sobre la causa raíz — es mejor preguntar que dañar el equipo

---

*Manual preparado por el Departamento Técnico de ServiClima Industrial S.A.*  
*Para actualizaciones o correcciones, contactar: soporte.tecnico@serviclima.cl*

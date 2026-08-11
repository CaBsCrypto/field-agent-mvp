# Protocolo de Instalación de Equipos HVAC

**Versión:** 1.8 | **Última actualización:** Agosto 2026  
**Aplica a:** Instalación de equipos de climatización y refrigeración nuevos  
**Empresa:** ServiClima Industrial S.A. — Procedimientos Técnicos Operacionales

---

## Introducción

Una instalación correcta es tan importante como el equipo mismo. Una instalación deficiente puede:
- Anular la garantía del fabricante
- Causar fallas prematuras del compresor
- Aumentar el consumo energético en un 20-40%
- Generar condensación en zonas no deseadas
- Crear riesgos eléctricos

Este protocolo es de **cumplimiento obligatorio** para todos los técnicos que realizan instalaciones. Cualquier desviación debe ser aprobada por el supervisor de instalaciones.

---

## PARTE I: REQUISITOS PREVIOS A LA INSTALACIÓN

### 1.1 Revisión del Sitio (Inspección Previa)

Antes del día de la instalación, el técnico o el ingeniero de proyecto debe verificar:

**Interior:**
- [ ] Espacio suficiente para la unidad interior (incluyendo espacio para mantenimiento)
- [ ] Superficie o estructura resistente para el soporte (consultar peso del equipo en la hoja de datos)
- [ ] Distancias mínimas de instalación respetadas (ver sección 1.3)
- [ ] Trayecto viable para la línea de refrigerante hacia el exterior
- [ ] Punto de descarga de condensados disponible o factible
- [ ] Toma eléctrica trifásica o monofásica disponible según el equipo

**Exterior:**
- [ ] Espacio para la unidad exterior con acceso libre al flujo de aire
- [ ] Superficie nivelada y resistente (hormigón, estructura metálica)
- [ ] Sin obstrucciones que limiten la evacuación del calor
- [ ] Protección ante inundaciones (la unidad debe estar elevada en zonas inundables)
- [ ] Acceso para mantenimiento futuro

---

### 1.2 Requisitos Eléctricos por Capacidad

> ⚠️ **El técnico eléctrico certificado debe verificar y aprobar la instalación eléctrica antes de energizar.**

| Capacidad del Equipo | Alimentación | Calibre Mínimo Cable | Protección (Breaker) |
|---------------------|-------------|---------------------|---------------------|
| Hasta 12.000 BTU (1 TR) | 220V / 1Ø | 2.5 mm² | 16A |
| 18.000 BTU (1.5 TR) | 220V / 1Ø | 4 mm² | 20A |
| 24.000 BTU (2 TR) | 220V / 1Ø | 4 mm² | 25A |
| 36.000 BTU (3 TR) | 220V / 1Ø o 3Ø | 6 mm² | 32A |
| 48.000 BTU (4 TR) | 220V / 3Ø | 6 mm² | 40A |
| 60.000 BTU (5 TR) | 220V / 3Ø | 10 mm² | 50A |
| 5-10 TR | 380V / 3Ø | 16-25 mm² | 50-80A |
| 10-20 TR | 380V / 3Ø | 25-50 mm² | 80-125A |
| > 20 TR (Chiller) | 380V / 3Ø | Diseño específico | Diseño específico |

**Notas eléctricas importantes:**
- El breaker dedicado debe ser de curva C (para cargas con motor)
- La línea de alimentación debe ser exclusiva para el equipo HVAC (no compartida)
- Se requiere cable de tierra (PE) en todos los casos
- En equipos > 5 TR: instalar protección diferencial tipo A (sensible a corrientes pulsantes DC)
- En equipos trifásicos: instalar relé de protección de fases (protege contra falta de fase, secuencia incorrecta y desequilibrio)

---

### 1.3 Distancias Mínimas de Instalación

**Unidad Interior (Split Mural):**

```
         [TECHO]
           30 cm mínimo
    ________________
   |                |
   |   UNIDAD       |  ← 10 cm mínimo a cada lado
   |   INTERIOR     |
   |________________|
           
           Espacio libre al frente: 1.5 m mínimo para circulación de aire
           
    [SUELO]
```

| Medida | Mínimo Recomendado |
|--------|-------------------|
| Distancia al techo | 10-15 cm |
| Distancia a pared lateral | 10 cm |
| Distancia a obstáculos frontales | 150 cm |
| Distancia mínima al suelo | 200 cm (para unidades murales) |

**Unidad Exterior:**

| Medida | Mínimo Recomendado |
|--------|-------------------|
| Espacio frontal (salida de aire) | 100 cm mínimo |
| Espacio trasero (entrada de aire) | 30 cm mínimo |
| Espacio lateral | 30 cm mínimo |
| Espacio superior (si hay techo) | 100 cm mínimo |
| Entre dos unidades exteriores lado a lado | 30 cm mínimo |

> ⚠️ **Nunca instalar una unidad exterior en espacios cerrados o pozos sin ventilación adecuada.**

**Longitud máxima de tubería:**
- Equipos hasta 2 TR: máximo 15-20 m de tubería equivalente
- Equipos 2-5 TR: máximo 25-30 m (verificar desnivel máximo permitido)
- Si supera los límites: se requiere carga adicional de refrigerante (ver fabricante)
- Desnivel máximo entre unidades: verificar en ficha técnica del modelo (generalmente 10-15 m)

---

## PARTE II: INSTALACIÓN MECÁNICA

### 2.1 Instalación de la Unidad Interior

**Herramientas necesarias:**
- Taladro percutor con brocas para hormigón y metal
- Nivel de burbuja
- Llave de impacto o llave de torque
- Cortador de tubería de cobre
- Escariador de tuberías

**Procedimiento:**
1. Marcar la posición de la placa de montaje en la pared usando el nivel
2. Verificar que la placa quede absolutamente horizontal (vital para el drenaje de condensados)
3. Anclar la placa con tornillos y tarugos adecuados para el tipo de pared (hormigón/tabique/drywall)
4. Verificar que los anclajes soporten el peso del equipo con un factor de seguridad x3
5. Para drywall: usar siempre anclajes metálicos expansivos que alcancen la estructura de la pared
6. Realizar el agujero pasante para las tuberías y el cableado (diámetro según kit de instalación del equipo)
7. Instalar el sifón o la manguera de drenaje con pendiente mínima del 2% hacia el exterior
8. Colgar la unidad interior en la placa de montaje y verificar que quede nivelada
9. Verificar que la bandeja de drenaje esté alineada y que el agua escurra al sifón

---

### 2.2 Instalación de la Unidad Exterior

1. Instalar los soportes anti-vibración bajo la unidad (obligatorio)
2. Nivelar la unidad con nivel de burbuja en dos ejes
3. Fijar la unidad a la losa o estructura metálica (tornillos de expansión o anclajes estructurales)
4. La unidad debe estar fijada para resistir viento y posibles sismos
5. Instalar las patas separadoras para elevar la unidad de la superficie (mínimo 10 cm) y facilitar el drenaje del agua de lluvia

---

### 2.3 Instalación de Tuberías de Refrigerante

> ℹ️ **El cobre utilizado debe ser tipo ACR (Air Conditioning and Refrigeration) — nunca cobre de gasfitería.**

**Diámetros de tubería por capacidad:**

| Capacidad | Tubería Gas (Succión) | Tubería Líquido |
|-----------|----------------------|-----------------|
| 9.000-12.000 BTU | 1/2" (12.7mm) | 1/4" (6.35mm) |
| 18.000-24.000 BTU | 5/8" (15.88mm) | 3/8" (9.52mm) |
| 30.000-36.000 BTU | 3/4" (19.05mm) | 3/8" (9.52mm) |
| 42.000-60.000 BTU | 7/8" (22.2mm) | 1/2" (12.7mm) |

**Procedimiento de instalación de tuberías:**

1. **Corte:** Usar cortador de tuberías de cobre. Nunca usar sierra (genera virutas metálicas).
2. **Escariado:** Escariar los extremos después del corte para eliminar rebabas.
3. **Abocinado:** Usar herramienta de abocinar de calidad (nunca golpear la tubería). El abocindo debe ser perfecto para evitar fugas.
4. **Doblado:** Usar doblador de tubería. NO doblar a mano (aplana la tubería y restringe el flujo).
5. **Soportes:** Instalar soportes cada 1.5 m en instalaciones horizontales; cada 2 m en verticales.
6. **Aislamiento:** Aislar TODA la tubería de gas (succión) con espuma armaflex o similar (espesor mínimo 13mm para exterior, 9mm para interior).
7. **Aislamiento tubería líquido:** También aislar la tubería de líquido en las zonas exteriores expuestas al sol.
8. **Fijación al muro:** Usar caña plástica o canal metálico para proteger las tuberías en exteriores.

---

## PARTE III: PROCEDIMIENTO DE CARGA DE REFRIGERANTE

> ⚠️ **Solo técnicos con certificación vigente de manejo de refrigerantes pueden realizar cargas.**

### 3.1 Evacuación del Sistema (Vacío)

**Este paso es obligatorio antes de cualquier carga de refrigerante.**

**Herramientas:**
- Bomba de vacío de 2 etapas (mínimo 4 CFM de capacidad)
- Micrómetro de vacío (manómetro de vacío calibrado)
- Manifold de carga

**Procedimiento:**
1. Conectar la bomba de vacío al manifold y al equipo (ambos puertos: alta y baja)
2. Abrir ambas válvulas del manifold
3. Encender la bomba de vacío
4. Verificar que el vacío descienda progresivamente (debe llegar a < 500 micrones)
5. Dejar operar la bomba hasta alcanzar 300-500 micrones (mínimo 30-45 minutos)
6. Una vez alcanzado el vacío deseado: cerrar las válvulas del manifold y apagar la bomba
7. **Prueba de retención de vacío:** Observar el micrómetro por 15 minutos
   - Si el vacío sube rápidamente → hay fuga (ver sección 3.2)
   - Si el vacío se mantiene o sube muy lentamente (< 100 micrones en 15 min) → sistema limpio y estanco
8. Registrar nivel de vacío alcanzado y tiempo de retención

---

### 3.2 Prueba de Estanqueidad

**La prueba de estanqueidad puede realizarse ANTES o DESPUÉS del vacío.**

**Método 1: Prueba con nitrógeno seco (preferido para instalaciones nuevas):**
1. Presurizar el sistema con nitrógeno seco a 1.1 veces la presión máxima de diseño (nunca superar)
2. Para sistemas con R-410A: presurizar a 30-35 bar
3. Dejar el sistema presurizado por mínimo 24 horas
4. Si la presión cae > 0.5 bar → hay fuga
5. Localizar la fuga con agua jabonosa o detector electrónico de gas
6. Liberar el nitrógeno, reparar la fuga y repetir la prueba
7. Registrar: presión inicial, presión final, tiempo, conclusión

**Método 2: Prueba con refrigerante trazador:**
1. Cargar una pequeña cantidad de refrigerante para presurizar el sistema
2. Verificar con detector electrónico de fugas alrededor de todas las uniones
3. Este método es menos recomendado porque contamina el sistema si hay fuga

---

### 3.3 Carga de Refrigerante

**Selección del refrigerante:**

| Refrigerante | Uso | Mezcla |
|-------------|-----|--------|
| R-410A | Equipos nuevos hasta aprox. 2025, aún muy común | Mezcla azeotrópica (cargar en estado líquido) |
| R-32 | Equipos nuevos (mejor EER, menor GWP) | Puro (puede cargarse líquido o gas) |
| R-22 | Equipos antiguos (en eliminación — regulado) | Puro |
| R-407C | Equipos intermedios | Mezcla zeotrópica (SIEMPRE líquido) |
| R-404A | Refrigeración (camaras frías) | Mezcla (SIEMPRE líquido) |

> ⚠️ **Para mezclas zeotropicas (R-407C, R-404A): SIEMPRE cargar en estado líquido del cilindro. Nunca en fase gaseosa — el fraccionamiento altera la composición de la mezcla.**

**Procedimiento de carga por peso (método preferido):**
1. Obtener la carga de refrigerante de la ficha técnica del equipo (en kg)
2. Pesar el cilindro de refrigerante en la balanza antes de cargar
3. Abrir la válvula del cilindro en el estado correcto (ver tabla arriba)
4. Abrir la válvula del lado de baja del manifold lentamente
5. Monitorear el peso del cilindro: detener cuando se haya transferido la cantidad exacta
6. Cerrar la válvula del cilindro y del manifold
7. Anotar la cantidad cargada y el número de lote del cilindro de refrigerante

**Procedimiento de carga por presión/temperatura (método de campo alternativo):**
1. Energizar el equipo y dejar estabilizar 15-20 minutos
2. Medir presión de baja y temperatura de saturación
3. Medir superheat en succión (ver sección de mantenimiento)
4. Agregar refrigerante por el lado de baja en pequeños pulsos (30 segundos ON, esperar 2 minutos para estabilizar)
5. Verificar superheat y subcooling después de cada pulso
6. Detener cuando se alcancen los valores normales de operación

---

## PARTE IV: PUESTA EN MARCHA Y VERIFICACIÓN

### 4.1 Verificaciones Previas al Primer Encendido

Antes de energizar el equipo nuevo, verificar:

- [ ] Todas las conexiones eléctricas apretadas y con valores correctos
- [ ] Cables de comunicación conectados correctamente (polaridad)
- [ ] Válvulas de servicio de la unidad exterior ABIERTAS (giro anti-horario hasta tope)
- [ ] Tubería de refrigerante completamente aislada
- [ ] Bandeja de drenaje nivelada y drenaje verificado
- [ ] No hay herramientas ni materiales dentro de las unidades
- [ ] El técnico eléctrico autorizó la conexión a la red
- [ ] El entorno está despejado para la operación segura

---

### 4.2 Primer Encendido

1. Energizar el breaker de alimentación
2. Si el equipo tiene resistencia de cárter: energizar 6-8 horas antes del primer arranque (en clima frío) o 2 horas (en clima templado)
3. Verificar que no haya alarmas o códigos de error en el display
4. Encender el equipo en modo FRÍO al setpoint más bajo
5. Observar el arranque del compresor y ventiladores
6. Verificar que no haya ruidos anormales
7. Esperar 15-20 minutos para que el sistema estabilice

---

### 4.3 Verificaciones de Puesta en Marcha

Registrar los siguientes parámetros en el Formulario FM-002 (Puesta en Marcha):

**Parámetros eléctricos:**
- [ ] Voltaje de alimentación: _____ V (debe estar dentro de ±10% del nominal)
- [ ] Desequilibrio de fases (trifásico): _____ % (máximo 2%)
- [ ] Amperaje compresor: _____ A (comparar con placa del equipo)
- [ ] Amperaje ventilador condensador: _____ A
- [ ] Amperaje ventilador evaporador: _____ A

**Parámetros del ciclo de refrigeración:**
- [ ] Presión de baja: _____ bar / _____ psi
- [ ] Presión de alta: _____ bar / _____ psi
- [ ] Temperatura saturación baja: _____ °C
- [ ] Temperatura saturación alta: _____ °C
- [ ] Temperatura succión: _____ °C
- [ ] Temperatura descarga: _____ °C
- [ ] Temperatura línea de líquido: _____ °C
- [ ] Superheat calculado: _____ °C (objetivo: 5-8°C)
- [ ] Subcooling calculado: _____ °C (objetivo: 5-10°C)

**Parámetros de climatización:**
- [ ] Temperatura aire retorno: _____ °C
- [ ] Temperatura aire impulsión (salida): _____ °C
- [ ] Diferencial de temperatura (ΔT): _____ °C (objetivo: 10-14°C)

---

### 4.4 Criterios de Aceptación de la Puesta en Marcha

| Parámetro | Valor Mínimo Aceptable |
|-----------|----------------------|
| Superheat | 4°C |
| Subcooling | 3°C |
| ΔT aire | 8°C |
| Voltaje | Nominal ±10% |
| Amperaje compresor | < 110% del nominal |
| Presiones | Dentro de rango para T° ambiente |
| Ruido | Sin ruidos anormales |

Si cualquier parámetro está fuera de rango, **no dar por completada la instalación**. Investigar la causa y corregir antes de firmar el acta de puesta en marcha.

---

## PARTE V: DOCUMENTACIÓN REQUERIDA AL CLIENTE

Al finalizar la instalación y la puesta en marcha, entregar al cliente:

### 5.1 Documentos Técnicos

1. **Acta de Instalación (FM-002):** Firmada por el técnico y el representante del cliente
   - Datos del equipo instalado (marca, modelo, serie, capacidad)
   - Datos de refrigerante (tipo, cantidad cargada, lote del cilindro)
   - Parámetros de puesta en marcha registrados
   - Observaciones

2. **Manual del Usuario:** Del fabricante, en idioma español
   - Instrucciones de operación básica
   - Limpieza del filtro (responsabilidad del usuario)
   - Cómo interpretar el control remoto

3. **Manual Técnico del Fabricante:** Para el técnico de servicio
   - Planos eléctricos
   - Tabla de presiones y temperaturas
   - Códigos de error
   - Procedimientos de servicio

4. **Certificado de Garantía:** Completar y entregar al cliente
   - Número de serie registrado
   - Fecha de instalación
   - Condiciones de la garantía
   - Contacto del servicio técnico autorizado

5. **Registro de Refrigerante (si aplica):** Formulario de manejo de sustancias según regulación vigente
   - Tipo y cantidad de refrigerante instalado
   - Número de cilindro/lote
   - Nombre y certificación del técnico que realizó la carga

---

### 5.2 Capacitación al Cliente

Antes de retirarse, realizar una breve capacitación al usuario (15-20 minutos):

1. Mostrar cómo encender y apagar el equipo
2. Explicar los modos de operación (frío, calor, ventilación, automático)
3. Indicar el setpoint de temperatura recomendado (22-24°C para bienestar y eficiencia)
4. Mostrar cómo limpiar el filtro de aire (frecuencia: mensual o según manual)
5. Indicar las señales de alerta (ruidos, errores en pantalla, agua goteando)
6. Entregar el contacto de servicio técnico de la empresa
7. Explicar qué NO hacer: tapar la unidad exterior, obstruir la salida de aire, etc.

---

### 5.3 Lista de Verificación Final

- [ ] Equipo operando correctamente al momento de la entrega
- [ ] Cliente o encargado ha sido capacitado en el uso básico
- [ ] Todos los documentos entregados y firmados
- [ ] Fotografías del equipo instalado tomadas y subidas al sistema
- [ ] Acta de puesta en marcha firmada por ambas partes
- [ ] Materiales sobrantes y residuos retirados del sitio
- [ ] El sitio quedó limpio y ordenado
- [ ] Registro en el sistema de gestión de la empresa actualizado

---

## PARTE VI: CASOS ESPECIALES

### 6.1 Instalaciones en Altitud (> 2.000 msnm)

En instalaciones sobre los 2.000 metros de altitud:
- El rendimiento del equipo se reduce aprox. 3% por cada 300 m sobre el nivel del mar
- La presión atmosférica reducida afecta el flujo de aire del condensador
- Es posible que se requiera un equipo de mayor capacidad
- Consultar al supervisor técnico antes de comprometerse con una instalación en altura.

### 6.2 Instalaciones en Zonas Costeras

- Usar equipos con recubrimiento anti-corrosión (Golden Fin, Blueevolution, etc.)
- Las válvulas de servicio y conexiones deben ser de acero inoxidable o protegidas
- Aumentar la frecuencia de limpieza del condensador (puede requerir mantenimiento mensual)
- Inspeccionar anualmente el estado de la corrosión del serpentín

### 6.3 Instalaciones en Locales de Alimentos o Farmacéuticos

- Verificar que el refrigerante sea compatible con las regulaciones del local
- Asegurar que no haya riesgo de contaminación cruzada por aire
- Registrar el tipo y cantidad de refrigerante en el registro sanitario del local si es requerido
- Consultar siempre con el encargado del local sobre los requisitos específicos

---

*Manual preparado por el Departamento Técnico de ServiClima Industrial S.A.*  
*Revisado y aprobado por: Jefatura Técnica*  
*Para actualizaciones o correcciones, contactar: soporte.tecnico@serviclima.cl*

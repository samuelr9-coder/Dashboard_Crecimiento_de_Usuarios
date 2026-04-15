# Explicación del Proyecto: Modelo de Crecimiento Logístico

Este proyecto consiste en un software diseñado para **modelar, proyectar y visualizar el crecimiento de usuarios** de una plataforma a lo largo del tiempo. 

El software se divide en dos entornos que realizan matemáticamente lo mismo, pero están enfocados en usos distintos:
1. **Un script en Python (`main.py`)**: Ideal para ejecución en consola, generación de gráficos estáticos y reportes rápidos.
2. **Un Dashboard Web (`index.html`, `script.js`, `style.css`)**: Una interfaz visual e interactiva que se ejecuta directamente en el navegador, permitiendo al usuario ver animaciones y gráficas interactivas detalladas.

---

## 1. Fundamentos Matemáticos

El corazón del software se basa en conceptos de cálculo y modelado matemático:

1. **Ecuación Logística ($N(t)$)**: Modela el crecimiento de usuarios. A diferencia del crecimiento exponencial infinito, este modelo asume que hay un límite máximo de usuarios (capacidad de carga, $K$). Arranca de forma acelerada, llega a un punto de inflexión y luego se estabiliza.
2. **Conteo de Nuevos Usuarios ($f(t)$)**: Es la **derivada** de la ecuación logística. Representa el ritmo o tasa a la que se registran nuevos usuarios cada mes. Al graficarse, forma una especie de "campana".
3. **Regla de Simpson 1/3**: Es un método numérico de integración. El software lo utiliza para calcular el área bajo la curva de la tasa de crecimiento ($f(t)$) en un periodo de tiempo (ej. 12 meses). Matemáticamente, hallar esta integral nos da los **usuarios totales acumulados** en ese tiempo.

---

## 2. Estructura de Archivos

### `main.py` (Script de Python)
Es el archivo principal de cálculo en backend. Realiza lo siguiente:
- Define los las funciones matemáticas `N(t)` (Ec. logística) y `f(t)` (Derivada).
- Implementa desde cero la **Regla de Simpson 1/3** mendiante la función `simpson_1_3`.
- Genera en la terminal una tabla validando paso a paso los coeficientes y las evaluaciones de las funciones.
- Utiliza la librería **Matplotlib** para generar y guardar un gráfico estático doble (`grafico_crecimiento.png`) mostrando el comportamiento de las curvas y resaltando el área bajo la curva calculada.
- Genera un reporte de "**Infraestructura**" (espacio en GB estimado para esa cantidad de usuarios y el crecimiento promedio).

### `index.html` (Estructura del Dashboard Web)
Es el esqueleto de la aplicación interactiva.
- Utiliza HTML semántico moderno para estructurar una cuadrícula (grid) de "Tarjetas de Métricas" y "Contenedores de Gráficos".
- Importa la fuente `Inter` de Google Fonts y la librería `Chart.js` para los gráficos interactivos.

### `script.js` (Lógica e Interactividad)
Se encarga de llevar las matemáticas del modelo a la web para que la visualización cobre vida:
- **Traducción Matemática**: Réplica las funciones `N(t)`, `f(t)` y la integración de `simpson_1_3` de Python a JavaScript.
- **Interactividad UI**: Ejecuta el cálculo al cargar la página e inyecta los resultados en las tarjetas (creando un efecto animado en los números).
- **Gráficos Dinámicos**: Configura `Chart.js` para dibujar dos gráficas con efectos visuales como gradientes de color, áreas sombreadas bajo la curva y tooltips dinámicos que muestran datos exactos al pasar el mouse.
- **Tabla de Validación**: Inserta dinámicamente las filas de la tabla de comprobación de la Regla de Simpson en el HTML.

### `style.css` (Diseño Visual)
*(Archivo no mostrado en detalle, pero vital en conjunto).*
Se encarga de dar al proyecto una apariencia "premium", tipo Dashboard moderno. Seguramente incorpora un esquema de colores oscuros, efectos "glassmorphism", transiciones suaves y un diseño adaptativo (responsive) para que se vea bien en varios tamaños de pantalla.

---

## 3. ¿Cómo funciona en la práctica?

Si deseas un reporte rápido y exportar una imagen para un documento, ejecutas el script de Python:
```bash
python main.py
```

Si deseas hacer una presentación, analizar interactivamente los puntos de los datos o simplemente disfrutar de una vista gerencial impactante, abres el archivo `index.html` en cualquier navegador web. El JavaScript interno hará los mismos cálculos que Python y pintará los resultados en pantalla.

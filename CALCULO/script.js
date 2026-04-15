
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";


/**
 * r: Tasa de crecimiento (0.65 indica un ritmo potencial acelerado)
 * K: Capacidad de carga. Es el tope máximo o "techo" de usuarios que el sistema/mercado alcanzará (200,000).
 * N0: Usuarios iniciales en el momento t=0 (400 usuarios).
 */
const r = 0.5;         // Tasa de crecimiento
const K = 100000;      // Capacidad de carga
const N0 = 500;        // Usuarios iniciales


function N(t) {
    const C = (K - N0) / N0;
    return K / (1 + C * Math.exp(-r * t));
}

/**
 * Función f(t): Derivada de N(t).
 * Representa la tasa de crecimiento, es decir, CUÁNTOS NUEVOS usuarios entran EXCLUSIVAMENTE en el mes 't'.
 */
function f(t) {
    const Nt = N(t);
    return r * Nt * (1 - Nt / K);
}

/**

 * 
 * @param {number} a - Límite inferior de tiempo (ej. mes 0)
 * @param {number} b - Límite superior de tiempo (ej. mes 12)
 * @param {number} n - Número de subintervalos. ¡Debe ser par! Define la precisión.
 */
function simpson_1_3(a, b, n) {
    // 1. Verificación: Simpson 1/3 requiere que el número de divisiones 'n' sea par para agrupar en pares.
    if (n % 2 !== 0) {
        throw new Error("El número de subintervalos (n) debe ser par.");
    }
    
    // h representa el tamaño del "paso" o ancho de cada subintervalo en el eje de tiempo.
    const h = (b - a) / n;
    
    // Arrays para guardar los valores: tiempos (t), alturas (f_vals) y multiplicadores (coefs)
    const t_vals = [];
    const f_vals = [];
    const coefs = [];
    
    // 2. Evaluamos la función f(t) para cada punto de los subintervalos
    for (let i = 0; i <= n; i++) {
        const t = a + i * h;    // Calculamos el mes específico (ej: t = 0, luego 1, luego 2...)
        t_vals.push(t);
        f_vals.push(f(t));      // Altura de la curva (nuevos usuarios en el mes 't')
        
        // 3. Asignación de Coeficientes de Simpson 1/3
        // La regla dice que los extremos se multiplican por 1, los impares por 4 y los pares por 2.
        // Patrón: [1, 4, 2, 4, 2, ..., 4, 1]
        if (i === 0 || i === n) {
            coefs.push(1); // Extremos (inicio y fin)
        } else if (i % 2 !== 0) {
            coefs.push(4); // Posiciones impares pesan más (4)
        } else {
            coefs.push(2); // Posiciones pares (2)
        }
    }
    
    // 4. Sumatoria final
    let sum = 0;
    for (let i = 0; i <= n; i++) {
        sum += coefs[i] * f_vals[i];
    }
    
    // 5. Aplicando la fórmula principal de Simpson 1/3: Integral = (h / 3) * Sumatoria
    const integral = (h / 3) * sum;
    
    // Retornamos tanto el total general como los datos desglosados (para dibujarlos en la tabla web)
    return { integral, t_vals, f_vals, coefs };
}


function initDashboard() {
    // Definimos el rango a evaluar: Desde el mes 0 hasta el mes 12
    const a = 0;
    const b = 12;
    const n = 12; // 12 puntos de evaluación en el año para Simpson
    
    // 1. Ejecutar Integración Simpson 1/3 para encontrar usuarios acumulados en el primer año
    const result = simpson_1_3(a, b, n);
    
    // 2. Poblar la tabla web de validación dinámicamente con los datos devueltos (t_vals, f_vals, coefs)
    const tableBody = document.querySelector('#simpsonTable tbody');
    result.t_vals.forEach((t, i) => {
        const tr = document.createElement('tr');
        // Iteramos los valores desglosados y creamos filas <tr> con celdas <td> en la tabla HTML
        tr.innerHTML = `
            <td>Mes ${t}</td>
            <td>${result.f_vals[i].toLocaleString('es-ES', {maximumFractionDigits: 2})}</td>
            <td>${result.coefs[i]}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    // 3. Cálculos de Infraestructura basados en los resultados obtenidos
    const usuarios_acumulados = result.integral; // El área bajo f(t) es el acumulado total del año
    // Asumimos conservadoramente que cada usuario pesa 50MB (50 / 1000 GB)
    const almacenamiento_gb = (usuarios_acumulados * 50) / 1000;
    const tasa_promedio = usuarios_acumulados / 12; // Promedio aritmético mensual de registros
    
    // 4. Animar los números del Dashboard para generar un efecto visual más inmersivo
    // En lugar de poner el número final directamente, sube de 0 hasta el destino en 1500 ms.
    animateValue(document.getElementById('totalUsers'), 0, usuarios_acumulados, 1500, '');
    animateValue(document.getElementById('storageGb'), 0, almacenamiento_gb, 1500, '');
    animateValue(document.getElementById('avgRate'), 0, tasa_promedio, 1500, ' / mes');

    // 5. Por último, pintamos los gráficos interactivos usando los sets de datos
    renderCharts();
}

/**
 * Función para renderizar los gráficos de Chart.js
 */
function renderCharts() {
    const t_plot = [];
    const N_plot = [];
    const f_plot = [];
    
    // Generar datos para 30 meses en pasos de 0.5
    for (let t = 0; t <= 30; t += 0.5) {
        t_plot.push(t);
        N_plot.push(N(t));
        f_plot.push(f(t));
    }

    // --- GRÁFICO 1: N(t) ---
    const ctxNt = document.getElementById('ntChart').getContext('2d');
    
    // Gradiente para el área bajo la curva (Azul)
    const gradientNt = ctxNt.createLinearGradient(0, 0, 0, 350);
    gradientNt.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradientNt.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    new Chart(ctxNt, {
        type: 'line',
        data: {
            labels: t_plot,
            datasets: [{
                label: 'Usuarios N(t)',
                data: N_plot,
                borderColor: '#3b82f6',
                backgroundColor: gradientNt,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return `Usuarios: ${Math.round(context.raw).toLocaleString('es-ES')}`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
            }
        }
    });

    // --- GRÁFICO 2: f(t) ---
    const ctxFt = document.getElementById('ftChart').getContext('2d');
    
    // Gradiente para el área (Naranja a Índigo)
    const gradientFt = ctxFt.createLinearGradient(0, 0, 0, 350);
    gradientFt.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
    gradientFt.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

    new Chart(ctxFt, {
        type: 'line',
        data: {
            labels: t_plot,
            datasets: [{
                label: 'Ritmo f(t)',
                data: f_plot,
                borderColor: '#f97316',
                backgroundColor: gradientFt,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return `Crecimiento: ${Math.round(context.raw).toLocaleString('es-ES')} / mes`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
            }
        }
    });
}

/**
 * Función de utilidad para animar contadores
 */
function animateValue(obj, start, end, duration, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Función de easing out expo
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = start + (end - start) * easeOutExpo;
        
        obj.innerHTML = currentVal.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Inicializar cuando el DOM cargue
document.addEventListener('DOMContentLoaded', initDashboard);

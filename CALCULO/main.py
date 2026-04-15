import numpy as np
import matplotlib.pyplot as plt

# Parámetros del modelo
r = 0.5         # Tasa de crecimiento
K = 100000    # Capacidad de carga
N0 = 500      # Usuarios iniciales

def N(t):
    """ Función logística que calcula el número de usuarios en el tiempo t. """
    C = (K - N0) / N0
    return K / (1 + C * np.exp(-r * t))

def f(t):
    """ Derivada de N(t), representa la tasa de crecimiento de nuevos usuarios por mes. """
    # Evaluamos N(t) primero para usar la misma ecuación
    Nt = N(t)
    return r * Nt * (1 - Nt / K)

def simpson_1_3(func, a, b, n):
    """
    Aproximación de la integral definida de func(t) en el intervalo [a, b] 
    usando la regla de Simpson 1/3 con n subintervalos.
    """
    if n % 2 != 0:
        raise ValueError("El número de subintervalos (n) debe ser un número par.")
    
    h = (b - a) / n
    t_vals = np.linspace(a, b, n + 1)
    f_vals = func(t_vals)
    
    # Coeficientes de Simpson
    coefs = np.ones(n + 1)
    coefs[1:-1:2] = 4
    coefs[2:-1:2] = 2
    
    # Cálculo de la integral
    integral = (h / 3) * np.sum(coefs * f_vals)
    
    return integral, t_vals, f_vals, coefs

def main():
    # 3. Integración Numérica con la Regla de Simpson 1/3
    a = 0
    b = 12
    n = 12
    
    integral, t_vals, f_vals, coefs = simpson_1_3(f, a, b, n)
    
    print("-" * 50)
    print("3. VALIDACIÓN DE LA TASA DE CRECIMIENTO f(t)")
    print("-" * 50)
    print(f"{'Mes (t)':<10} | {'f(t) evaluado':<15} | {'Coeficiente':<10}")
    print("-" * 50)
    for i in range(len(t_vals)):
        print(f"{t_vals[i]:<10.0f} | {f_vals[i]:<15.2f} | {coefs[i]:<10.0f}")
    print("-" * 50)
    print(f"\nValor aproximado de la integral (Simpson 1/3) en t=[0, 12]: {integral:.2f}\n")
    
    # 4. Visualizaciones con Matplotlib
    t_plot = np.linspace(0, 30, 500)
    N_plot = N(t_plot)
    f_plot = f(t_plot)
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 12))
    
    # Subgráfico 1: Curva N(t)
    ax1.plot(t_plot, N_plot, color='blue', linewidth=2, label='N(t) - Ecuación Logística')
    # Marca de fase de crecimiento inicial (aprox t=5)
    ax1.annotate('Crecimiento\nInicial', xy=(5, N(5)), xytext=(2, 20000),
                 arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=5))
    # Punto de inflexión
    t_inflection = np.log((K - N0) / N0) / r
    N_inflection = N(t_inflection)
    ax1.plot(t_inflection, N_inflection, 'ro', label=f'Punto de Inflexión (t={t_inflection:.1f})')
    ax1.annotate('Punto de\nInflexión', xy=(t_inflection, N_inflection), xytext=(10, 60000),
                 arrowprops=dict(facecolor='red', shrink=0.05, width=1, headwidth=5))
    # Fase de saturación
    ax1.annotate('Fase de Saturación', xy=(25, N(25)), xytext=(20, 80000),
                 arrowprops=dict(facecolor='green', shrink=0.05, width=1, headwidth=5))
                 
    ax1.set_title('Modelo de Crecimiento de Usuarios a Crecimiento Logístico: N(t)')
    ax1.set_xlabel('Tiempo (meses)')
    ax1.set_ylabel('Número de Usuarios')
    ax1.grid(True, linestyle='--', alpha=0.7)
    ax1.legend()

    # Subgráfico 2: Curva f(t)
    ax2.plot(t_plot, f_plot, color='orange', linewidth=2, label='f(t) - Tasa de Crecimiento (Campana)')
    
    # Sombrear el área bajo la curva
    t_shade = np.linspace(0, 12, 100)
    f_shade = f(t_shade)
    ax2.fill_between(t_shade, f_shade, color='orange', alpha=0.3, label='Área Evaluada por Simpson (0 a 12 meses)')
    
    ax2.set_title('Tasa de Crecimiento de Nuevos Usuarios por Mes: f(t)')
    ax2.set_xlabel('Tiempo (meses)')
    ax2.set_ylabel('Nuevos Usuarios / mes')
    ax2.grid(True, linestyle='--', alpha=0.7)
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig('grafico_crecimiento.png')
    # Uncomment the following line if you wish to display the plot interactively
    # plt.show()
    
    # 5. Resumen Automático de Infraestructura
    usuarios_acumulados = integral
    almacenamiento_gb = (usuarios_acumulados * 50) / 1000  # 50 MB en GB asumiendo 1GB = 1000MB
    tasa_promedio = usuarios_acumulados / 12
    
    print("-" * 50)
    print("5. RESUMEN AUTOMÁTICO DE INFRAESTRUCTURA")
    print("-" * 50)
    print(f"[{'x'}] Usuarios acumulados en el primer año : {usuarios_acumulados:,.2f} usuarios")
    print(f"[{'x'}] Almacenamiento estimado total        : {almacenamiento_gb:,.2f} GB")
    print(f"[{'x'}] Tasa promedio mensual final          : {tasa_promedio:,.2f} usuarios/mes")
    print("-" * 50)

    # 6. Sincronizar automáticamente con el archivo Web (script.js)
    import re
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
            
        # Reemplazar valores dinámicamente usando expresiones regulares
        js_content = re.sub(r'const r = [0-9.]+;', f'const r = {r};', js_content)
        js_content = re.sub(r'const K = \d+;', f'const K = {K};', js_content)
        js_content = re.sub(r'const N0 = \d+;', f'const N0 = {N0};', js_content)
        
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("\n" + "-" * 50)
        print("[x] SINCRONIZACIÓN EXITOSA: La página web (script.js) ha sido actualizada con los datos de Python.")
        print("-" * 50 + "\n")
    except FileNotFoundError:
        print("\n[-] Advertencia: No se encontró 'script.js' para sincronización automática.")
    except Exception as e:
        print(f"\n[-] Error al sincronizar: {e}")

if __name__ == "__main__":
    main()

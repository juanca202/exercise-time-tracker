# GET `/api/activity` — actividad reciente para resumen (`Movement[]`)

## Alcance

Define el contrato HTTP para obtener la actividad reciente del usuario autenticado que se muestra en la landing de resumen.
El DTO de respuesta se denomina `Movement`.

## Endpoint

| Aspecto   | Valor                             |
| --------- | --------------------------------- |
| Metodo    | `GET`                             |
| Ruta      | `/api/activity`                   |
| Respuesta | `application/json` (`Movement[]`) |

Las rutas publicas del proyecto deben usar segmentos en ingles; `/api/activity` cumple esa convencion.

## Respuesta exitosa — `Movement[]`

Devuelve un arreglo JSON de `Movement`:

| Campo           | Tipo   | Obligatorio | Descripcion                                                  |
| --------------- | ------ | ----------- | ------------------------------------------------------------ |
| `accountNumber` | string | Si          | Numero de cuenta asociado al movimiento.                     |
| `date`          | string | Si          | Fecha del movimiento en formato ISO 8601.                    |
| `description`   | string | Si          | Descripcion breve del movimiento para mostrar en la UI.      |
| `amount`        | number | Si          | Importe numerico del movimiento; admite positivo y negativo. |

**Ejemplo:**

```json
[
  {
    "accountNumber": "001234567890",
    "date": "2026-05-05T09:30:00Z",
    "description": "Transferencia recibida",
    "amount": 250.0
  },
  {
    "accountNumber": "001234567890",
    "date": "2026-05-04T21:10:00Z",
    "description": "Pago de servicio",
    "amount": -42.75
  },
  {
    "accountNumber": "009876543210",
    "date": "2026-05-04T08:05:00Z",
    "description": "Compra comercio",
    "amount": -15.9
  }
]
```

## Notas de implementacion

- Este contrato cubre el alcance demo de actividad reciente en la landing.
- El formato visual de fecha relativa en la UI se calcula en frontend a partir de `date`.

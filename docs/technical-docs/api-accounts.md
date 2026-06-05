# GET `/api/accounts` — listado de cuentas para resumen (`Account[]`)

## Alcance

Define el contrato HTTP para obtener cuentas del usuario autenticado que se muestran en la landing de resumen.
El DTO de respuesta se denomina `Account`.

## Endpoint

| Aspecto   | Valor                            |
| --------- | -------------------------------- |
| Metodo    | `GET`                            |
| Ruta      | `/api/accounts`                  |
| Respuesta | `application/json` (`Account[]`) |

Las rutas publicas del proyecto deben usar segmentos en ingles; `/api/accounts` cumple esa convencion.

## Respuesta exitosa — `Account[]`

Devuelve un arreglo JSON de `Account`:

| Campo     | Tipo   | Obligatorio | Descripcion                                                                                       |
| --------- | ------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `id`      | string | Si          | Identificador unico de la cuenta.                                                                 |
| `number`  | string | Si          | Numero de cuenta para mostrar (se recomienda enmascarar en UI).                                   |
| `balance` | number | Si          | Monto numerico a mostrar en resumen: saldo para `saving`/`checking` y consumo para `credit-card`. |
| `type`    | string | Si          | Tipo de cuenta. Valores permitidos: `saving`, `checking`, `credit-card`.                          |
| `name`    | string | No          | Nombre visible de la cuenta en UI.                                                                |

**Ejemplo:**

```json
[
  {
    "id": "acc-001",
    "number": "001234567890",
    "balance": 1250.5,
    "type": "saving",
    "name": "Cuenta principal"
  },
  {
    "id": "acc-002",
    "number": "009876543210",
    "balance": 420.0,
    "type": "checking"
  },
  {
    "id": "acc-003",
    "number": "4111111111111111",
    "balance": -120.75,
    "type": "credit-card",
    "name": "Tarjeta clasica"
  }
]
```

## Notas de implementacion

- Este contrato cubre el alcance demo del resumen de cuentas.
- Para `credit-card`, `balance` representa consumo acumulado; el cupo disponible no se expone en este endpoint.

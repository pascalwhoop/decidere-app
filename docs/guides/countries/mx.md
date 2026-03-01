# Mexico (MX) Tax Configuration Guide

## Overview

Mexico uses a progressive income tax system called ISR (Impuesto Sobre la Renta) with 11 brackets ranging from 1.92% to 35%. The system includes mandatory social security (IMSS) contributions and an employment subsidy for low-income workers.

**Currency**: Mexican Pesos (MXN). Approximate exchange rate: 1 USD = 20.5 MXN (Feb 2026).

## Tax Year 2026

### ISR (Income Tax)

Mexico's ISR uses a "lower limit + fixed fee + marginal rate on excess" structure. This is mathematically equivalent to a standard progressive bracket system, but the SAT (Servicio de Administracion Tributaria) publishes tables with pre-computed fixed fees for each bracket.

**2026 Annual Brackets** (updated for accumulated inflation exceeding 10%):

| From (MXN) | To (MXN) | Fixed Fee (MXN) | Rate on Excess |
|---|---|---|---|
| 0.01 | 10,135.11 | 0 | 1.92% |
| 10,135.12 | 86,022.11 | 194.59 | 6.40% |
| 86,022.12 | 151,176.19 | 5,051.37 | 10.88% |
| 151,176.20 | 175,735.66 | 12,140.13 | 16.00% |
| 175,735.67 | 210,403.69 | 16,069.64 | 17.92% |
| 210,403.70 | 424,353.97 | 22,282.14 | 21.36% |
| 424,353.98 | 668,840.14 | 67,981.92 | 23.52% |
| 668,840.15 | 1,276,925.98 | 125,485.07 | 30.00% |
| 1,276,925.99 | 1,702,567.97 | 307,910.81 | 32.00% |
| 1,702,567.98 | 5,107,703.92 | 444,116.23 | 34.00% |
| 5,107,703.93 | and above | 1,601,862.46 | 35.00% |

**Implementation**: Uses `bracket_tax` with `base_amount` fields, which the engine handles natively (German-style bracket computation).

### IMSS (Social Security) Employee Contributions

Employee contributions have three components:
- **Sickness & Maternity**: 0.625% of salary + 0.4% of excess above 3 UMA
- **Disability & Life**: 0.625% of salary
- **Retirement (Cesantia y Vejez)**: 1.125% of salary

Total base rate: **2.375%** on salary up to the IMSS cap.

**IMSS Cap**: 25 times the daily UMA = 25 * 117.31 * 365 = MXN 1,070,578.75/year

**UMA 2026**: MXN 117.31/day, MXN 3,566.22/month, MXN 42,794.64/year

The additional 0.4% sickness/maternity surtax applies only on salary above 3 UMA annual (MXN 128,383.92).

### Employment Subsidy (Subsidio al Empleo)

For 2026, employees earning below MXN 11,492.66/month (MXN 137,911.92/year) receive a monthly subsidy of MXN 536.21 (annual: MXN 6,434.52). This is credited against ISR owed and cannot exceed the ISR liability (non-refundable).

This effectively eliminates income tax for very low earners (below ~MXN 80,000/year, the subsidy fully covers the ISR).

## Variants

### Non-Resident (`non-resident`)

Non-residents are taxed at simplified withholding rates on Mexican-source employment income:
- First MXN 125,900: **Exempt**
- MXN 125,900 to 1,000,000: **15%**
- Above MXN 1,000,000: **30%**

No IMSS contributions apply for non-residents without a Mexican employer. No employment subsidy is available.

## Special Regimes NOT Implemented

### RESICO (Regimen Simplificado de Confianza)

RESICO is a simplified trust regime for individuals with business/professional income under MXN 3,500,000/year. Rates range from 1% to 2.5% with no deductions allowed. **Not applicable to salaried employees**, so it was not implemented as a variant.

RESICO annual rates:
- Up to MXN 300,000: 1%
- Up to MXN 600,000: 1.1%
- Up to MXN 1,000,000: 1.5%
- Up to MXN 2,500,000: 2%
- Up to MXN 3,500,000: 2.5%

### Digital Nomad Tax Considerations

Mexico does not have a specific digital nomad visa or tax regime. Digital nomads typically use the Temporary Resident Visa. Key considerations:

1. **Tax residency**: Determined by home location, center of vital interests, or 183-day presence
2. **Source-based taxation**: Income earned while physically in Mexico is Mexican-source income
3. **No special expat regime**: Unlike NL (30% ruling), ES (Beckham Law), or IT (Impatriate), Mexico does not offer a special tax regime for foreign workers
4. **Temporary residents**: Those on temporary resident visas working for foreign employers may be subject to non-resident rates if they don't meet tax residency criteria
5. **Enforcement gap**: While tax obligations technically exist, enforcement for remote workers earning from abroad is limited in practice

## Simplifications and Limitations

1. **IMSS simplified**: The actual IMSS calculation uses SBC (Salario Base de Cotizacion) which integrates bonuses, aguinaldo, and vacation premium. Our model uses gross salary as a proxy.
2. **No personal deductions**: Mexico allows personal deductions for medical expenses, school tuition, mortgage interest, charitable donations, and funeral expenses (capped at 5 UMA or 15% of income). These are not modeled.
3. **No state payroll tax**: Mexican states levy a 1-3% payroll tax, but this is paid by the employer, not deducted from employee salary.
4. **No aguinaldo modeling**: The mandatory Christmas bonus (15 days salary) is partially tax-exempt. Our model assumes it is included in the gross annual figure.
5. **No Northern Border Zone**: The Northern Border Free Zone has different minimum wages and some tax incentives not modeled here.

## Sources

- SAT Official Annex 8 (2026 ISR tables): https://www.sat.gob.mx
- PwC Mexico Tax Summary: https://taxsummaries.pwc.com/mexico/individual/taxes-on-personal-income
- OECD Tax and Benefit Descriptions for Mexico: https://www.oecd.org
- Mexico payroll changes 2026: https://help.nativeteams.com/mexico-payroll-changes-2026
- Overview of payroll management 2026: https://www.ascg.mx/medios/overview-of-payroll-management-in-mexico-for-2026/

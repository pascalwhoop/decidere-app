# Belgium 2026

Belgium 2026 is modeled as a payroll-oriented employee salary calculation for a single annual gross salary input.

## Implemented

- Employee social security (`ONSS`/`RSZ`) at `13.07%`
- Employee work bonus for low wages, annualized from ONSS monthly formulas
- Standard employee professional expense deduction at `30%`, capped at `EUR 6,070`
- Federal income tax brackets for income year 2026 / assessment year 2027:
  - `0 - 16,720`: `25%`
  - `16,720 - 29,510`: `40%`
  - `29,510 - 51,070`: `45%`
  - `51,070+`: `50%`
- Base tax-free allowance of `EUR 11,180`
- Child allowance additions for dependent children
- Official 2026 municipal surcharge lookup for Belgian communes, with manual override fallback
- Special social security contribution estimated from ONSS payroll withholding bands
- Pension savings tax reduction
- Regional service voucher tax reductions
- Direct regional mortgage/housing tax reduction input
- Company car taxable benefit input
- Meal voucher net benefit
- Mobility budget pillar 2 and cash payout treatment
- Inbound taxpayer/researcher special regime variant

## Important modeling note

The special social security contribution is not modeled as a final household-income reconciliation. The current config uses employer payroll withholding bands from the social security instructions, which is suitable for gross-to-net salary estimation but can differ from the final annual settlement on the tax return.

The config covers regular employee salary and common benefits. It does not include spouse income, real professional expenses, replacement income, or bonus-specific withholding.

Company cars are modeled by entering the annual taxable benefit shown by the employer or calculated separately. The config does not derive the benefit from catalogue value, fuel type, age, and CO2.

Mortgage and housing benefits are modeled as a direct regional tax-reduction input because Belgian regimes depend on region, loan date, dwelling status, and legacy rules.

## Sources

- `https://fin.belgium.be/en/private-individuals/tax-return/tax-rates-income/tax-rates` - official federal brackets and tax-free allowance
- `https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/socialsecuritycontributions/contributions.html` - ONSS employee social security rates
- `https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/deductions/workers_reductions/workbonus.html` - ONSS work bonus formulas
- `https://www.socialsecurity.be/employer/instructions/dmfa/fr/latest/instructions/special_contributions/other_specialcontributions/specialsocialsecuritycontribution.html` - ONSS special social security contribution withholding
- `https://www.bdo.be/en-gb/insights/news-alerts/2026/key-figures-indexed-amounts-of-income-tax-for-the-2025-2026-2027-tax-year` - indexed allowance and flat-rate expense cap table
- `https://fin.belgium.be/sites/default/files/media/documents/taux-taxe-communale-2026.pdf` - official 2026 municipal surcharge rates

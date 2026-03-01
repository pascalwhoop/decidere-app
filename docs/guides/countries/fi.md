# Finland (FI) 2026 Tax Configuration

## Overview

Finland uses a Nordic dual income tax system. Earned income (salaries, pensions) is taxed progressively at the state level plus flat municipal and optional church taxes. Capital income is taxed separately at 30%/34% (not covered by this calculator).

## Tax Components

### 1. State Progressive Income Tax (Valtion tulovero)

6 brackets applied to taxable earned income:

| Bracket | Threshold | Marginal Rate |
|---------|-----------|---------------|
| 1 | 0 | 12.64% |
| 2 | 22,000 | 19.00% |
| 3 | 32,500 | 30.25% |
| 4 | 53,800 | 34.00% |
| 5 | 91,000 | 41.75% |
| 6 | 155,000 | 44.25% |

Source: FinArmour (from Vero.fi 2026 Framework)

### 2. Municipal Tax (Kunnallisvero)

Flat rate varying by municipality (4.7% to 10.9%). Applied to the same taxable income base as state tax.

Post-SOTE reform (2023) rates implemented:
- Helsinki: 5.30%
- Espoo: 5.30%
- Vantaa: 6.40%
- Tampere: 7.60%
- Turku: 7.10%
- Oulu: 8.10%
- National average: 7.60%

Source: vero.fi official municipal/parish tax rates page

### 3. Church Tax (Kirkollisvero)

Optional - only for members of the Evangelical Lutheran or Orthodox Church. Rates vary 1.00-2.25% by parish. Helsinki Evangelical Lutheran: 1.00%.

### 4. Employee Social Insurance Contributions

| Contribution | Rate | Notes |
|-------------|------|-------|
| TyEL pension | 7.30% | Same for all ages from 2026 (was 8.65% for 53-62) |
| Unemployment insurance | 0.89% | Increased from 0.59% in 2025 |
| Health care (sairausvakuutus) | 1.10% | Medical care insurance |
| Daily allowance | 0.88% | Only if income >= 17,255/year |
| **Total** | **~10.17%** | |

### 5. YLE Broadcasting Tax (Yle-vero)

2.5% of income above 15,150 EUR, maximum 160 EUR.

### 6. Basic Deduction (Perusvahennys)

- Maximum: 4,265 EUR
- Applies to BOTH state and municipal taxable income (since 2023)
- Phases out at 18% of pure earned income above 4,265
- Zero when pure earned income > ~27,959

### 7. Work Income Tax Credit (Tyotulovahennys)

- Build-up: 18% of gross work income, maximum 3,430
- Phaseout 1: 2% of pure earned income above 35,000
- Phaseout 2: 3.44% of pure earned income above 42,550
- Offsets: state tax first, then overflow to municipal, church, and health care
- Does NOT offset daily allowance contribution or YLE tax

## Calculation Flow

1. **Gross salary** (input)
2. **Employee contributions**: TyEL pension (7.30%) + unemployment (0.89%) calculated on gross
3. **Pure earned income** = gross - 750 (income deduction) - TyEL pension - unemployment insurance
   - Note: Health care and daily allowance are NOT deducted from gross for pure earned income
4. **Basic deduction** = max(0, 4265 - 0.18 * max(0, pure_earned_income - 4265))
5. **Taxable income** = pure_earned_income - basic_deduction
6. **State tax** = bracket_tax(taxable_income, state_brackets)
7. **Municipal tax** = taxable_income * municipal_rate
8. **Church tax** = taxable_income * church_rate (if member)
9. **Health care** = gross * 1.10%
10. **Daily allowance** = gross * 0.88% (if gross >= 17,255)
11. **Work credit** = min(3430, gross * 0.18) - phaseout
12. **Total income tax** = max(0, (state + municipal + church + health) - work_credit)
13. **YLE tax** = min(160, max(0, (gross - 15150) * 0.025))
14. **Net** = gross - total_income_tax - daily_allowance - YLE - TyEL - unemployment

## Key Employee Variant (Avainhenkilovero)

Flat 25% tax rate for qualifying foreign specialists (reduced from 32% in 2025).

**Replaces**: All progressive taxes (state, municipal, church) + health care + daily allowance

**Keeps**: TyEL pension (7.30%) + unemployment (0.89%) + YLE broadcasting tax

**Effective total rate**: ~33.3-33.4% (25% + 7.30% + 0.89% + ~0.2% YLE)

**Eligibility**:
- Monthly salary >= 5,800 EUR
- Work requires special expertise
- Not been Finnish tax resident for past 5 years
- Apply within 90 days of starting work
- Foreign nationals: max 84 months
- Returning Finnish citizens (new in 2026): max 60 months

## Key Changes from 2025

- TyEL pension: 7.30% for ALL ages (was 8.65% for ages 53-62)
- Unemployment insurance: 0.89% (was 0.59%)
- Health care: 1.10% (was 1.06%), Daily allowance: 0.88% (was 0.84%)
- State tax brackets updated (new top rate 44.25%)
- Work income tax credit max increased to 3,430 (was 2,140)
- Basic deduction max increased to 4,265 (was 4,115)
- Key employee rate reduced to 25% (was 32%)
- Returning Finnish citizens now eligible for key employee regime
- Home office deduction abolished for employees
- Union fee deduction abolished

## Calibration Notes

The model was calibrated against the vero.fi official "Tax rates on pay, pensions and benefits" table for 2026 (Helsinki, Evangelical Lutheran, age 17-64). Results match within 0.4 percentage points across all income levels from 10k-70k EUR. The vero.fi table rounds to 0.5% increments, so sub-0.5pp deviations are expected.

Key gotchas discovered during calibration:
1. Only TyEL pension and unemployment are deducted from gross for pure earned income (NOT health/daily allowance)
2. Basic deduction applies to BOTH state and municipal tax (since 2023, was municipal-only before)
3. Work credit offsets state + municipal + church + health care, but NOT daily allowance
4. FinArmour brackets (6) are more accurate than Finnish government budget proposals (5 brackets)
5. Municipal rates changed significantly post-SOTE reform (lower than pre-2023)

## Sources

- vero.fi - Official automatic deductions 2026
- vero.fi - Official tax rates on pay 2026 (validation table)
- vero.fi - Tax bases 2026 (health, daily allowance rates)
- FinArmour - Finland 2026 state tax brackets (from Vero.fi 2026 Framework)
- Ministry of Social Affairs and Health - Social insurance contributions 2026
- Ilmarinen - TyEL pension 7.30% for all ages from 2026
- Bloomberg Tax - Parliament bill: work credit parameters
- Vialto Partners - Key employee tax changes 2026
- YLE News - Finland's new 25% flat tax for foreign experts

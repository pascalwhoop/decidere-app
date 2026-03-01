# Austria (AT) Tax Configuration Guide

## Overview

Austria uses a progressive income tax system with 7 brackets (0% to 55%) and a unique 14-salary-per-year system where the 13th and 14th month payments receive preferential flat-rate taxation.

**Complexity Level:** High - Requires `function` node due to the 14-salary system with split taxation between regular and special payments, tiered unemployment insurance reduction for low earners, and separate social security calculations for regular vs. special payments.

## Tax System Summary (2026)

### Income Tax (Einkommensteuer)

Progressive brackets applied to taxable income after social security and Werbungskostenpauschale deduction:

| Bracket | Rate |
|---------|------|
| 0 - 13,539 | 0% |
| 13,539 - 21,992 | 20% |
| 21,992 - 36,458 | 30% |
| 36,458 - 70,365 | 40% |
| 70,365 - 104,859 | 48% |
| 104,859 - 1,000,000 | 50% |
| Above 1,000,000 | 55% (extended to 2029) |

Brackets are inflation-indexed annually (2/3 of inflation rate). For 2026: +1.73% (2/3 of 2.6%).

### Social Security (Sozialversicherung / ASVG)

Employee contribution rates:

| Component | Rate | Notes |
|-----------|------|-------|
| Pension (Pensionsversicherung) | 10.25% | Largest component |
| Health (Krankenversicherung) | 3.87% | Covers dependents |
| Unemployment (Arbeitslosenversicherung) | 0-2.95% | Tiered for low earners |
| Chamber of Labour (AK-Umlage) | 0.50% | Mandatory |
| Housing Subsidy (Wohnbaufoerderung) | 0.50% / 0.75% | 0.75% in Vienna from 2026 |
| **Total** | **~18.07%** | **18.32% in Vienna** |

**Cap:** EUR 6,930/month (EUR 83,160 annually for 12 months).

**Low-income unemployment insurance reduction (2026):**
- Up to EUR 2,225/month: 0% (fully exempt)
- EUR 2,225.01 - 2,427: 1%
- EUR 2,427.01 - 2,630: 2%
- Above EUR 2,630: 2.95% (full rate)

### 14-Salary System (Sonderzahlungen)

This is the most complex aspect of Austrian payroll:

- Employees receive **14 salaries per year**: 12 regular + holiday bonus (13th) + Christmas bonus (14th)
- **Regular payments (12 months):** Taxed at progressive rates after SV deduction
- **Special payments (13th/14th month):**
  - SV at reduced rate: 17.07% employee (vs 18.07% regular)
  - SV cap: EUR 13,860/year for special payments
  - First EUR 620 tax-free
  - Then 6% flat rate (up to EUR 25,000 tax base)
  - Higher graduated rates above EUR 25,000 (27%, 35.75%, 50%)
  - This is a significant tax advantage, saving EUR 1,000-5,000+/year

### Tax Credits

- **Verkehrsabsetzbetrag (Transport credit):** EUR 496/year - directly reduces tax
- **Werbungskostenpauschale:** EUR 132/year - reduces taxable income
- **Alleinverdienerabsetzbetrag (Single-earner):** EUR 612/year with one child (not in base config)
- **Family Bonus Plus:** EUR 2,000.16/child/year under 18 (not in base config)

## Implementation Notes

### Why a Function Node?

The Austrian tax system cannot be expressed in pure YAML because:

1. **Split taxation:** Regular and special payments have completely different tax treatments
2. **Different SV rates:** 18.07% for regular, 17.07% for special payments
3. **Separate SV caps:** EUR 6,930/month for regular, EUR 13,860/year total for special
4. **Tiered unemployment:** Low-income workers get reduced rates (requires monthly income check)
5. **The function stores intermediate values** in `context.nodes` so the YAML can reference them

The `austria_full_year_tax` function in `packages/engine/src/functions.ts`:
- Splits annual gross into regular (12/14) and special (2/14) payments
- Computes effective unemployment rate based on monthly income tier
- Calculates SV separately for regular and special payments with different rates/caps
- Computes progressive income tax on regular pay after SV + Werbungskostenpauschale deduction
- Computes flat 6% tax on special payments after SV + EUR 620 exemption
- Applies Verkehrsabsetzbetrag (transport credit) against regular income tax
- Stores total SV in `context.nodes['total_social_security']` for the breakdown

### Variant: Zuzugsfreibetrag (Researcher Tax Relief)

The `zuzugsfreibetrag` variant overrides the function call with `taxable_fraction: 0.70`, which:
- Reduces the taxable gross for income tax to 70% of actual gross
- Keeps social security on the full 100% gross (as per Austrian law)
- Results in ~10-15% tax savings for qualifying researchers

## Official Sources

- **Official tax brackets:** [USP Unternehmensserviceportal](https://www.usp.gv.at/en/themen/steuern-finanzen/einkommensteuer-ueberblick/weitere-informationen-est/tarifstufen.html)
- **Social security rates:** [PwC Austria](https://taxsummaries.pwc.com/austria/individual/other-taxes)
- **SV caps and thresholds:** [BDO Austria](https://www.bdo.at/en-gb/insights/people-organisation/the-expected-social-security-contributions-2026)
- **Tax credits 2026:** [Moore Salzburg](https://www.moore-salzburg.at/en/sozialversicherungswerte-2026/)
- **Official Brutto-Netto calculator:** [BMF Brutto-Netto-Rechner](https://www.bmf.gv.at/brutto-netto-rechner)
- **Test verification:** [karriere.at Brutto-Netto-Rechner](https://www.karriere.at/brutto/)
- **Zuzugsfreibetrag:** [ARTUS Steuerberatung](https://artus.at/en/blog/tax-benefits-for-international-researchers-and-scientists-moving-to-austria/)

## Expat Regime Research Summary

### Zuzugsfreibetrag (Section 103(1a) EStG) - Implemented as Variant

- **What:** 30% reduction of taxable income from scientific/research activity
- **Who:** Scientists, researchers, university professors relocating to Austria
- **Duration:** Maximum 5 years
- **Application:** Written application to Federal Ministry of Finance within 6 months of relocation
- **Scope:** Narrower than NL 30% ruling (scientists/researchers only, not general skilled workers)
- **Additional option:** Flat average tax rate of at least 15% on foreign income (not modeled)

### Expatriate Flat-Rate Professional Expenses (Section 63 EStG)

- **What:** 20% flat-rate deduction for professional expenses, max EUR 10,000/year
- **Who:** Employees posted to Austria from abroad
- **Not modeled:** This is a business expense deduction, not a tax regime change

### Other Regimes Researched (Not Applicable)

- **No general flat tax for expats:** Unlike Italy, Spain (Beckham Law), or Portugal (IFICI)
- **No researcher flat rate:** Unlike Denmark (27%) or Sweden (25% exemption) - Austria uses income reduction instead
- **No digital nomad tax:** Austria has no special digital nomad regime
- **No non-resident flat rate:** Non-residents pay progressive rates like residents (plus fictitious income addition)
- **Pauschalierung:** Simplified taxation for self-employed, not relevant for employees

## Comparison with Germany (DE)

| Aspect | Austria | Germany |
|--------|---------|---------|
| Top rate | 55% (above EUR 1M) | 45% (above EUR 277,826) |
| Effective top | 55% | ~47.5% (with Soli) |
| SV employee rate | ~18.07% | ~20.5% (varies) |
| SV cap | EUR 6,930/month | EUR 8,450/month (pension) |
| Salary system | 14 months | 12 months |
| 13th/14th month tax | 6% flat rate | Regular progressive |
| Church tax | Voluntary, ~1.1% | 8-9% of income tax |
| Soli surcharge | None | 5.5% (above threshold) |
| Filing status | Single only | Ehegattensplitting |

The 14-salary system with 6% flat taxation is Austria's unique competitive advantage - it can offset the higher marginal rates compared to Germany.

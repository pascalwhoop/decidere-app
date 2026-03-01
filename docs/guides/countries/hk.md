# Hong Kong (HK) - Tax Research Guide

## Tax Year

Hong Kong's Year of Assessment runs from **1 April to 31 March**. Our config `hk/2025` covers the **2025/26 Year of Assessment** (1 April 2025 - 31 March 2026).

## System Overview

Hong Kong uses a **territorial tax system** - only income sourced in Hong Kong is subject to tax. There is no worldwide taxation, no capital gains tax, no VAT/GST, no withholding tax on employment income, and no inheritance tax.

### Salaries Tax - Dual Computation

The unique feature of Hong Kong's salaries tax is the **dual computation**:

1. **Progressive rates** on **Net Chargeable Income** (assessable income - deductions - personal allowances)
2. **Two-tiered standard rate** on **Net Income** (assessable income - deductions, but NO personal allowances)

The taxpayer pays **whichever is lower**. This means high earners are effectively capped at approximately 15%.

### Progressive Rates (2025/26)

| Net Chargeable Income | Rate |
|---|---|
| First HK$50,000 | 2% |
| Next HK$50,000 | 6% |
| Next HK$50,000 | 10% |
| Next HK$50,000 | 14% |
| Remainder | 17% |

### Two-Tiered Standard Rate (2025/26)

| Net Income | Rate |
|---|---|
| First HK$5,000,000 | 15% |
| Remainder | 16% |

### Crossover Point

The standard rate becomes beneficial at approximately HK$2,000,000+ annual income for single filers. Below that, progressive rates (with the benefit of personal allowances) produce lower tax.

## Personal Allowances (2025/26)

| Allowance | Amount (HKD) |
|---|---|
| Basic (single) | 132,000 |
| Married person's | 264,000 |
| Single parent | 132,000 |
| Child (each, 1st-9th) | 130,000 |
| Child (year of birth) | 260,000 |
| Dependent parent/grandparent (60+, not living with) | 50,000 |
| Dependent parent/grandparent (60+, living with) | 100,000 |
| Dependent parent/grandparent (55-59, not living with) | 25,000 |
| Dependent parent/grandparent (55-59, living with) | 50,000 |
| Dependent brother/sister | 37,500 |

Note: Starting from 2026/27, these amounts will be increased (basic to HK$145,000, married to HK$290,000, etc.) per the 2026-27 Budget.

### Implementation Decision

For the initial config, we implement only **basic** and **married** allowances. Child and dependent parent allowances could be added as optional inputs in a future iteration, but they significantly complicate the input form for a minority of use cases.

## Mandatory Provident Fund (MPF)

- **Employee contribution**: 5% of monthly relevant income
- **Monthly cap**: HK$1,500 (annual HK$18,000) - applies when monthly income exceeds HK$30,000
- **Minimum threshold**: Employees earning below HK$7,100/month are exempt from employee contributions
- **Tax deductibility**: Mandatory contributions are tax-deductible up to HK$18,000/year

### MPF Exemptions for Expats

Expats on **employment visas (Section 11 of Immigration Ordinance)** are exempt if:
1. Their visa validity is 13 months or less, OR
2. They are members of a recognized retirement scheme outside Hong Kong

Once a visa is extended beyond 13 months, the exemption ceases and the employer must enroll the employee in MPF within 60 days.

**Important**: Dependant visa holders are NOT exempt from MPF even though their conditions of stay are under Section 11.

## Expat Regime Analysis

### No Special Expat Tax Regime

Unlike many countries (NL 30% ruling, ES Beckham Law, IT Impatriate regime, etc.), **Hong Kong does not have a separate expat tax regime**. The base tax system IS the expat-friendly system:

1. **Territorial taxation**: Only HK-sourced income taxed (biggest feature)
2. **Standard rate cap at 15%**: Acts as a built-in cap for high earners
3. **No capital gains tax**: Investment gains are tax-free
4. **Simple system**: No complex social security, no joint filing complications
5. **Low rates**: Even the progressive rates max at 17%

### Top Talent Pass Scheme (TTPS)

The TTPS is an **immigration** scheme, not a tax scheme. It provides:
- Entry to Hong Kong without a job offer (Category A: HK$2.5M+ income; Category B/C: top university graduates)
- Same tax treatment as any other worker
- No special tax benefits

### Quality Migrant Admission Scheme (QMAS)

Similarly an immigration scheme with no special tax benefits.

### Non-Resident Workers

Non-residents performing services in Hong Kong are subject to the same salaries tax rates. The only difference is:
- **60-day rule**: Services rendered during visits of 60 days or less in a tax year are generally exempt
- Source rules determine what portion of income is HK-sourced

## Allowable Deductions (Not Implemented in Calculator)

For reference, these deductions are available but not modeled in the calculator:

| Deduction | Maximum (2025/26) |
|---|---|
| Mandatory MPF contributions | HK$18,000 (implemented) |
| Self-education expenses | HK$100,000 |
| Home loan interest | HK$100,000 (HK$120,000 with newborn) |
| Elderly residential care | HK$100,000 |
| Charitable donations | 35% of net income |
| Recognized retirement scheme | HK$18,000 |
| Voluntary MPF + annuity premiums | HK$60,000 |
| VHIS premiums | HK$8,000/insured person |
| Domestic rental expenses | HK$100,000 |

## One-Off Tax Reductions

The government periodically grants one-off tax reductions:
- **2025/26**: 100% reduction, capped at HK$3,000 (proposed in 2026-27 Budget, subject to legislation)
- **2024/25**: 100% reduction, capped at HK$1,500

These are NOT included in the calculator as they are temporary and change annually.

## Official Sources

- [GovHK Tax Rates](https://www.gov.hk/en/residents/taxes/taxfiling/taxrates/salariesrates.htm)
- [IRD Salaries Tax Guide (PAM39)](https://www.ird.gov.hk/eng/pdf/pam39e.pdf)
- [IRD Budget Tax Measures](https://www.ird.gov.hk/eng/tax/budget.htm)
- [PwC Hong Kong Tax Summary](https://taxsummaries.pwc.com/hong-kong-sar/individual/taxes-on-personal-income)
- [MPFA Coverage](https://www.mpfa.org.hk/en/mpf-system/mpf-coverage)
- [MPFA Guidelines IV.15 - Exemptions](https://www.mpfa.org.hk/en/-/media/files/information-centre/legislation-and-regulations/guidelines/current-version/part-iv/iv-15/iv_15.pdf)

## Test Vector Verification

Test vectors were manually calculated and cross-referenced against:
1. The IRD's PAM39 guide worked examples (HK$480,000 single and married)
2. PwC's sample tax calculation for 2025/26
3. Progressive rate and standard rate tables from GovHK

The IRD example (HK$480,000 single = HK$38,100 tax; married = HK$15,720 tax) matches exactly.

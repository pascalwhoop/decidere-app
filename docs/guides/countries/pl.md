# Poland (PL) Tax Configuration Guide

## Overview

Poland uses a progressive personal income tax system with two main brackets, plus a range of alternative tax regimes popular with self-employed professionals. The system is notably different for employment contracts (umowa o prace) vs B2B contracts (dzialalnosc gospodarcza).

**Currency:** PLN (Polish Zloty)

## Tax System Summary (2026)

### Employment (umowa o prace) - Base Config

| Component | Rate / Amount |
|-----------|--------------|
| PIT bracket 1 | 12% on first 120,000 PLN |
| PIT bracket 2 | 32% above 120,000 PLN |
| Tax-free amount | 30,000 PLN (via 3,600 PLN tax-reducing amount) |
| Employee ZUS (social) | 13.71% (pension 9.76% + disability 1.50% + sickness 2.45%) |
| ZUS cap (pension+disability) | 282,600 PLN/year |
| Health insurance (NFZ) | 9% of income after ZUS, NOT deductible from tax |
| Standard KUP | 3,000 PLN/year (local) or 3,600 PLN/year (commuters) |
| Solidarity levy | 4% on taxable income above 1,000,000 PLN |
| Under-26 exemption | PIT-free up to 85,528 PLN/year |

### B2B Lump Sum / Ryczalt IT - Variant

| Component | Rate / Amount |
|-----------|--------------|
| Tax rate | 12% on gross revenue (IT services PKWiU 62.01/62.02) |
| Tax base | Revenue (no expense deductions) |
| ZUS social | Fixed ~23,121 PLN/year (full rate entrepreneur) |
| Health insurance | Tiered: 5,540 / 9,967 / 16,620 PLN/year (by revenue) |
| Health deduction | 50% of health contributions deductible from revenue |
| Tax-free amount | Does NOT apply |

### B2B Flat Tax 19% - Variant

| Component | Rate / Amount |
|-----------|--------------|
| Tax rate | 19% flat on income (revenue minus costs) |
| ZUS social | Fixed ~23,121 PLN/year (full rate entrepreneur) |
| Health insurance | 4.9% of income (minimum 432.54 PLN/month) |
| Health deduction | Up to 14,100 PLN/year deductible |
| Tax-free amount | Does NOT apply |
| Solidarity levy | 4% above 1,000,000 PLN still applies |

### Return Relief (Ulga na powrot) - Variant

| Component | Rate / Amount |
|-----------|--------------|
| PIT exemption | Up to 85,528 PLN/year for 4 consecutive years |
| Eligibility | New tax residents (not resident for 3+ years before) |
| ZUS/Health | Still fully applicable |

## Key Research Sources

1. **PwC Tax Summaries - Poland Individual**: https://taxsummaries.pwc.com/poland/individual/taxes-on-personal-income
2. **Accace 2026 Tax Guideline**: https://www.accace.com/tax-guideline-for-poland/
3. **GetSix ZUS 2026**: https://getsix.eu/human-resources-payroll-in-poland/social-insurance-institution-zus-contributions-in-poland-in-2026-current-bases-limits-and-contribution-amounts-for-entrepreneurs/
4. **Podatki.wtf B2B Calculator**: https://www.podatki.wtf/?lang=en
5. **SMAR Global Taxation Systems**: https://smarglobal.com/choosing-taxation-system-2026-poland/

## Important Design Decisions

### Employment vs B2B

Poland has a fundamental distinction between employment contracts and B2B contracts that affects virtually every tax calculation:

- **Employment (umowa o prace):** Percentage-based ZUS, 9% health, tax-free amount applies, employer withholds
- **B2B (dzialalnosc gospodarcza):** Fixed ZUS, choice of taxation form, self-reporting

We model employment as the **base config** and B2B options as **variants**, since the calculator uses gross annual salary as the primary input.

### Health Insurance Post-Polski Lad

Since the "Polski Lad" reform (2022), the 9% health insurance contribution is NO LONGER deductible from income tax for employees. This was a major change that significantly increased effective tax rates. The old system allowed 7.75% to be deducted from tax.

### ZUS Contribution Cap

The annual cap for pension+disability contributions (282,600 PLN in 2026) creates a regressive effect at high incomes. Above the cap, only the 2.45% sickness contribution continues. Health insurance (9%) has no cap.

### Under-26 Exemption

Young workers (under 26) are exempt from PIT on employment income up to 85,528 PLN/year. This is modeled as a boolean input in the base config. ZUS and health insurance still apply.

### Return Relief

The "ulga na powrot" (return relief) works identically to the under-26 exemption mechanically but targets new tax residents. It exempts up to 85,528 PLN from PIT for 4 years. This is one of Europe's most attractive relocation incentives.

### Ryczalt Health Tiers

Under lump sum taxation, health insurance uses fixed tiers based on annual revenue rather than a percentage. The tiers use the average enterprise sector salary from Q4 of the previous year. The 2026 values are estimates based on the known average salary.

## Regimes NOT Modeled

- **IP Box (5%):** Planned restrictions in 2026 requiring 3+ employees make this impractical for most individual contractors. The regime is in flux and may be further modified.
- **Tax Card (karta podatkowa):** Effectively eliminated for new applicants since 2022.
- **Umowa zlecenie (mandate contracts):** Different ZUS rules, partially modeled by the base config if full ZUS applies.
- **Umowa o dzielo (work contracts):** No ZUS at all, 20% KUP, very different calculation.
- **Copyright 50% KUP:** Employees in creative/IT roles can sometimes deduct 50% of income as costs (capped at 120,000 PLN). Not modeled due to complexity of eligibility.

## Gotchas

1. **Health insurance is NOT deductible for employees** since 2022. Many online calculators from before 2022 show the old rules.
2. **ZUS cap only covers pension+disability.** Sickness (2.45%) and health (9%) have NO cap.
3. **Solidarity levy base:** The 4% levy is on taxable income (after ZUS and KUP), not gross income.
4. **Ryczalt has NO cost deductions.** The 12% tax is on revenue, so it's only beneficial when actual business costs are low (common for IT contractors working from home).
5. **Fixed ZUS for B2B is substantial.** At ~23,121 PLN/year, it represents a massive burden for low-income entrepreneurs. This makes B2B only worthwhile above ~100,000 PLN/year.
6. **Multiple PIT-0 reliefs share one limit.** Under-26, return relief, families 4+, and working seniors all share the 85,528 PLN limit.

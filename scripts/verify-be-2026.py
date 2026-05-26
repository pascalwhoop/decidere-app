#!/usr/bin/env python3
"""Independent Belgium 2026 salary arithmetic verifier.

This intentionally does not import the TypeScript engine. It implements the
documented official formulas and indexed values used by configs/be/2026.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Result:
    gross: float
    net: float
    effective_rate: float
    employee_social_security: float
    work_bonus_annual: float
    special_social_security: float
    professional_expenses: float
    income_tax: float
    municipal_tax: float
    pension_savings_tax_reduction: float = 0.0
    service_voucher_tax_reduction: float = 0.0
    regional_housing_tax_reduction_applied: float = 0.0
    meal_voucher_net_benefit: float = 0.0
    mobility_budget_cash_contribution: float = 0.0
    tax_free_benefits: float = 0.0
    inbound_tax_free_allowance: float = 0.0


def bracket_tax(income: float, brackets: list[tuple[float, float]]) -> float:
    if income <= 0:
        return 0.0

    tax = 0.0
    remaining = income
    for index, (threshold, rate) in enumerate(brackets):
        next_threshold = brackets[index + 1][0] if index + 1 < len(brackets) else float("inf")
        amount = min(remaining, next_threshold - threshold)
        if amount <= 0:
            break
        tax += amount * rate
        remaining -= amount
    return tax


def child_allowance(children: int) -> float:
    if children <= 0:
        return 0.0
    if children == 1:
        return 2130.0
    if children == 2:
        return 5230.0
    if children == 3:
        return 11720.0
    if children == 4:
        return 18970.0
    return 18970.0 + (children - 4) * 7240.0


def calculate(
    gross: float,
    municipal_rate: float = 0.07,
    children: int = 0,
    pension_savings: float = 0.0,
    pension_scheme: str = "standard",
    service_vouchers: float = 0.0,
    service_voucher_region: str = "flanders",
    service_voucher_price: float = 10.0,
    regional_housing_tax_reduction: float = 0.0,
    company_car_taxable_benefit: float = 0.0,
    meal_vouchers: float = 0.0,
    meal_voucher_value: float = 10.0,
    meal_voucher_employee_contribution: float = 1.09,
    mobility_budget_pillar2: float = 0.0,
    mobility_budget_cash: float = 0.0,
    inbound_allowance_rate: float = 0.0,
) -> Result:
    monthly = gross / 12.0
    quarterly = gross / 4.0

    ordinary_ssc = gross * 0.1307

    if monthly <= 2777.83:
        bonus_a = 120.59
    elif monthly <= 3271.48:
        bonus_a = max(0.0, 120.59 - 0.2443 * (monthly - 2777.83))
    else:
        bonus_a = 0.0

    if monthly <= 2175.25:
        bonus_b = 162.62
    elif monthly <= 2777.83:
        bonus_b = max(0.0, 162.62 - 0.2699 * (monthly - 2175.25))
    else:
        bonus_b = 0.0

    work_bonus = min((bonus_a + bonus_b) * 12.0, ordinary_ssc)
    employee_ssc = ordinary_ssc - work_bonus

    inbound_allowance = gross * inbound_allowance_rate
    taxable_before_expenses = gross + company_car_taxable_benefit - employee_ssc - inbound_allowance
    professional_expenses = min(taxable_before_expenses * 0.30, 6070.0)
    taxable_income = taxable_before_expenses - professional_expenses

    income_brackets = [
        (0.0, 0.25),
        (16720.0, 0.40),
        (29510.0, 0.45),
        (51070.0, 0.50),
    ]
    allowance_brackets = [
        (0.0, 0.25),
        (11750.0, 0.30),
        (16720.0, 0.40),
        (27860.0, 0.45),
        (51070.0, 0.50),
    ]

    gross_income_tax = bracket_tax(taxable_income, income_brackets)
    allowance_tax_value = bracket_tax(11180.0 + child_allowance(children), allowance_brackets)

    if pension_scheme == "increased":
        pension_reduction = min(pension_savings, 1350.0) * 0.25
    else:
        pension_reduction = min(pension_savings, 1050.0) * 0.30

    if service_voucher_region == "flanders":
        service_reduction = min(service_vouchers, 198.0) * 1.80
    elif service_voucher_region == "wallonia":
        service_reduction = min(service_vouchers, 150.0) * service_voucher_price * 0.10
    else:
        service_reduction = 0.0

    pre_housing_tax = max(0.0, gross_income_tax - allowance_tax_value - pension_reduction - service_reduction)
    housing_reduction = min(regional_housing_tax_reduction, pre_housing_tax)
    income_tax_before_municipal = max(
        0.0,
        gross_income_tax - allowance_tax_value - pension_reduction - service_reduction - housing_reduction,
    )
    municipal_tax = income_tax_before_municipal * municipal_rate
    income_tax = income_tax_before_municipal + municipal_tax

    if quarterly <= 5836.14:
        special_quarterly = 0.0
    elif quarterly <= 6570.54:
        special_quarterly = 3.0 * 0.0422 * (monthly - 1945.38)
    elif quarterly <= 11211.0:
        special_quarterly = 30.99 + 3.0 * 0.0110 * (monthly - 2190.18)
    elif quarterly <= 12300.0:
        special_quarterly = 82.05 + 3.0 * 0.0338 * (monthly - 3737.0)
    elif quarterly <= 18000.0:
        special_quarterly = 118.83 + 3.0 * 0.0600 * (monthly - 4100.0)
    else:
        special_quarterly = 182.82

    special_ssc = special_quarterly * 4.0
    meal_benefit = meal_vouchers * max(0.0, meal_voucher_value - meal_voucher_employee_contribution)
    mobility_cash_contribution = mobility_budget_cash * 0.3807
    mobility_cash_net = mobility_budget_cash - mobility_cash_contribution
    tax_free_benefits = meal_benefit + mobility_budget_pillar2 + mobility_cash_net

    total_deductions = employee_ssc + special_ssc + income_tax
    net = gross + tax_free_benefits - total_deductions
    return Result(
        gross=gross,
        net=round(net, 2),
        effective_rate=total_deductions / gross if gross else 0.0,
        employee_social_security=round(employee_ssc, 2),
        work_bonus_annual=round(work_bonus, 2),
        special_social_security=round(special_ssc, 2),
        professional_expenses=round(professional_expenses, 2),
        income_tax=round(income_tax, 2),
        municipal_tax=round(municipal_tax, 2),
        pension_savings_tax_reduction=round(pension_reduction, 2),
        service_voucher_tax_reduction=round(service_reduction, 2),
        regional_housing_tax_reduction_applied=round(housing_reduction, 2),
        meal_voucher_net_benefit=round(meal_benefit, 2),
        mobility_budget_cash_contribution=round(mobility_cash_contribution, 2),
        tax_free_benefits=round(tax_free_benefits, 2),
        inbound_tax_free_allowance=round(inbound_allowance, 2),
    )


if __name__ == "__main__":
    cases = [
        ("low", calculate(24000.0, 0.07, 0)),
        ("median", calculate(50000.0, 0.07, 0)),
        ("high", calculate(100000.0, 0.07, 0)),
        ("with_children", calculate(50000.0, 0.07, 2)),
        (
            "benefits_antwerpen",
            calculate(
                50000.0,
                0.07,
                1,
                pension_savings=1050.0,
                service_vouchers=100,
                service_voucher_region="flanders",
                regional_housing_tax_reduction=1200.0,
                company_car_taxable_benefit=2400.0,
                meal_vouchers=220,
                mobility_budget_pillar2=3000.0,
                mobility_budget_cash=2000.0,
            ),
        ),
        (
            "inbound",
            calculate(
                80000.0,
                0.065,
                0,
                meal_vouchers=220,
                inbound_allowance_rate=0.35,
            ),
        ),
    ]

    for name, result in cases:
        print(
            name,
            {
                "net": result.net,
                "effective_rate": round(result.effective_rate, 8),
                "employee_social_security": result.employee_social_security,
                "work_bonus_annual": result.work_bonus_annual,
                "special_social_security": result.special_social_security,
                "professional_expenses": result.professional_expenses,
                "income_tax": result.income_tax,
                "municipal_tax": result.municipal_tax,
            },
        )

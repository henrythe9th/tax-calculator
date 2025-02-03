// Constants for tax calculations
const TAX_RATES = {
    FICA: {
        SOCIAL_SECURITY: 0.062,
        SOCIAL_SECURITY_MAX: 168600, // 2024 limit
        MEDICARE: 0.0145,
        ADDITIONAL_MEDICARE: 0.009 // Above $200k
    },
    FEDERAL: [
        { bracket: 11600, rate: 0.10 },
        { bracket: 47150, rate: 0.12 },
        { bracket: 100525, rate: 0.22 },
        { bracket: 191950, rate: 0.24 },
        { bracket: 243725, rate: 0.32 },
        { bracket: 609350, rate: 0.35 },
        { bracket: Infinity, rate: 0.37 }
    ],
    STATE: {
        AL: [{ bracket: Infinity, rate: 0.05 }], // Flat 5%
        AK: [], // No state income tax
        AZ: [{ bracket: Infinity, rate: 0.025 }], // Flat 2.5%
        AR: [
            { bracket: 4300, rate: 0.02 },
            { bracket: 8500, rate: 0.04 },
            { bracket: Infinity, rate: 0.055 }
        ],
        CA: [
            { bracket: 10099, rate: 0.01 },
            { bracket: 23942, rate: 0.02 },
            { bracket: 37788, rate: 0.04 },
            { bracket: 52455, rate: 0.06 },
            { bracket: 66295, rate: 0.08 },
            { bracket: 338639, rate: 0.093 },
            { bracket: 406364, rate: 0.103 },
            { bracket: 677275, rate: 0.113 },
            { bracket: Infinity, rate: 0.123 }
        ],
        CO: [{ bracket: Infinity, rate: 0.0444 }], // Flat 4.44%
        CT: [
            { bracket: 10000, rate: 0.03 },
            { bracket: 50000, rate: 0.05 },
            { bracket: 100000, rate: 0.055 },
            { bracket: Infinity, rate: 0.0699 }
        ],
        DE: [
            { bracket: 5000, rate: 0.022 },
            { bracket: 10000, rate: 0.039 },
            { bracket: 20000, rate: 0.048 },
            { bracket: 25000, rate: 0.052 },
            { bracket: 60000, rate: 0.0655 }
        ],
        FL: [], // No state income tax
        GA: [
            { bracket: 750, rate: 0.01 },
            { bracket: 2250, rate: 0.02 },
            { bracket: 3750, rate: 0.03 },
            { bracket: 5250, rate: 0.04 },
            { bracket: 7000, rate: 0.05 },
            { bracket: Infinity, rate: 0.0575 }
        ],
        HI: [
            { bracket: 2400, rate: 0.014 },
            { bracket: 4800, rate: 0.032 },
            { bracket: 9600, rate: 0.055 },
            { bracket: 14400, rate: 0.064 },
            { bracket: 19200, rate: 0.068 },
            { bracket: 24000, rate: 0.072 },
            { bracket: 36000, rate: 0.076 },
            { bracket: 48000, rate: 0.079 },
            { bracket: 150000, rate: 0.0825 },
            { bracket: 175000, rate: 0.09 },
            { bracket: 200000, rate: 0.10 },
            { bracket: Infinity, rate: 0.11 }
        ],
        ID: [{ bracket: Infinity, rate: 0.058 }], // Flat 5.8%
        IL: [{ bracket: Infinity, rate: 0.0495 }], // Flat 4.95%
        IN: [{ bracket: Infinity, rate: 0.0315 }], // Flat 3.15%
        IA: [
            { bracket: 6000, rate: 0.044 },
            { bracket: 30000, rate: 0.0482 },
            { bracket: 75000, rate: 0.0598 },
            { bracket: Infinity, rate: 0.0600 }
        ],
        KS: [
            { bracket: 15000, rate: 0.031 },
            { bracket: 30000, rate: 0.0525 },
            { bracket: Infinity, rate: 0.057 }
        ],
        KY: [{ bracket: Infinity, rate: 0.045 }], // Flat 4.5%
        LA: [
            { bracket: 12500, rate: 0.0185 },
            { bracket: 50000, rate: 0.035 },
            { bracket: Infinity, rate: 0.0425 }
        ],
        ME: [
            { bracket: 24500, rate: 0.058 },
            { bracket: 58050, rate: 0.0675 },
            { bracket: Infinity, rate: 0.0715 }
        ],
        MD: [
            { bracket: 1000, rate: 0.02 },
            { bracket: 2000, rate: 0.03 },
            { bracket: 3000, rate: 0.04 },
            { bracket: 100000, rate: 0.0475 },
            { bracket: 125000, rate: 0.05 },
            { bracket: 150000, rate: 0.0525 },
            { bracket: 250000, rate: 0.055 },
            { bracket: Infinity, rate: 0.0575 }
        ],
        MA: [{ bracket: Infinity, rate: 0.05 }], // Flat 5%
        MI: [{ bracket: Infinity, rate: 0.0425 }], // Flat 4.25%
        MN: [
            { bracket: 30070, rate: 0.0535 },
            { bracket: 98760, rate: 0.068 },
            { bracket: 183340, rate: 0.0785 },
            { bracket: Infinity, rate: 0.0985 }
        ],
        MS: [
            { bracket: 5000, rate: 0.04 },
            { bracket: 10000, rate: 0.05 },
            { bracket: Infinity, rate: 0.05 }
        ],
        MO: [
            { bracket: 1121, rate: 0.015 },
            { bracket: 2242, rate: 0.02 },
            { bracket: 3363, rate: 0.025 },
            { bracket: 4484, rate: 0.03 },
            { bracket: 5605, rate: 0.035 },
            { bracket: 6726, rate: 0.04 },
            { bracket: 7847, rate: 0.045 },
            { bracket: 8968, rate: 0.05 },
            { bracket: Infinity, rate: 0.0495 }
        ],
        MT: [
            { bracket: 3600, rate: 0.01 },
            { bracket: 5800, rate: 0.02 },
            { bracket: 8900, rate: 0.03 },
            { bracket: 12100, rate: 0.04 },
            { bracket: 15400, rate: 0.05 },
            { bracket: 19800, rate: 0.06 },
            { bracket: Infinity, rate: 0.0675 }
        ],
        NE: [
            { bracket: 3700, rate: 0.0246 },
            { bracket: 22170, rate: 0.0351 },
            { bracket: 35730, rate: 0.0501 },
            { bracket: Infinity, rate: 0.0664 }
        ],
        NV: [], // No state income tax
        NH: [], // Only taxes interest and dividends
        NJ: [
            { bracket: 20000, rate: 0.014 },
            { bracket: 35000, rate: 0.0175 },
            { bracket: 40000, rate: 0.035 },
            { bracket: 75000, rate: 0.05525 },
            { bracket: 500000, rate: 0.0637 },
            { bracket: 1000000, rate: 0.0897 },
            { bracket: Infinity, rate: 0.1075 }
        ],
        NM: [
            { bracket: 5500, rate: 0.017 },
            { bracket: 11000, rate: 0.032 },
            { bracket: 16000, rate: 0.047 },
            { bracket: 210000, rate: 0.049 },
            { bracket: Infinity, rate: 0.059 }
        ],
        NY: [
            { bracket: 8500, rate: 0.04 },
            { bracket: 11700, rate: 0.045 },
            { bracket: 13900, rate: 0.0525 },
            { bracket: 21400, rate: 0.059 },
            { bracket: 80650, rate: 0.0597 },
            { bracket: 215400, rate: 0.0633 },
            { bracket: 1077550, rate: 0.0685 },
            { bracket: Infinity, rate: 0.0882 }
        ],
        NC: [{ bracket: Infinity, rate: 0.0475 }], // Flat 4.75%
        ND: [
            { bracket: 41775, rate: 0.011 },
            { bracket: 101050, rate: 0.0204 },
            { bracket: 210825, rate: 0.0227 },
            { bracket: 458350, rate: 0.0264 },
            { bracket: Infinity, rate: 0.029 }
        ],
        OH: [
            { bracket: 26050, rate: 0.0285 },
            { bracket: 46100, rate: 0.0333 },
            { bracket: 92150, rate: 0.038 },
            { bracket: 115300, rate: 0.0427 },
            { bracket: Infinity, rate: 0.0485 }
        ],
        OK: [
            { bracket: 1000, rate: 0.0025 },
            { bracket: 2500, rate: 0.0075 },
            { bracket: 3750, rate: 0.0175 },
            { bracket: 4900, rate: 0.0275 },
            { bracket: 7200, rate: 0.0375 },
            { bracket: Infinity, rate: 0.0475 }
        ],
        OR: [
            { bracket: 3750, rate: 0.0475 },
            { bracket: 9450, rate: 0.0675 },
            { bracket: 125000, rate: 0.0875 },
            { bracket: Infinity, rate: 0.099 }
        ],
        PA: [{ bracket: Infinity, rate: 0.0307 }], // Flat 3.07%
        RI: [
            { bracket: 68200, rate: 0.0375 },
            { bracket: 155050, rate: 0.0475 },
            { bracket: Infinity, rate: 0.0599 }
        ],
        SC: [
            { bracket: 3200, rate: 0.03 },
            { bracket: 6410, rate: 0.04 },
            { bracket: 9620, rate: 0.05 },
            { bracket: 12820, rate: 0.06 },
            { bracket: Infinity, rate: 0.07 }
        ],
        SD: [], // No state income tax
        TN: [], // No state income tax
        TX: [], // No state income tax
        UT: [{ bracket: Infinity, rate: 0.0485 }], // Flat 4.85%
        VT: [
            { bracket: 42150, rate: 0.0335 },
            { bracket: 102200, rate: 0.066 },
            { bracket: 213150, rate: 0.076 },
            { bracket: Infinity, rate: 0.0875 }
        ],
        VA: [
            { bracket: 3000, rate: 0.02 },
            { bracket: 5000, rate: 0.03 },
            { bracket: 17000, rate: 0.05 },
            { bracket: Infinity, rate: 0.0575 }
        ],
        WA: [], // No state income tax
        WV: [
            { bracket: 10000, rate: 0.03 },
            { bracket: 25000, rate: 0.04 },
            { bracket: 40000, rate: 0.045 },
            { bracket: 60000, rate: 0.06 },
            { bracket: Infinity, rate: 0.065 }
        ],
        WI: [
            { bracket: 13810, rate: 0.0354 },
            { bracket: 27630, rate: 0.0465 },
            { bracket: 304170, rate: 0.0530 },
            { bracket: Infinity, rate: 0.0765 }
        ],
        WY: [] // No state income tax
    },
    FEDERAL_STANDARD_DEDUCTION: 14600, // 2024 single filer
    STATE_STANDARD_DEDUCTION: {
        AL: 3000,
        AK: 0, // No state income tax
        AZ: 12950,
        AR: 2200,
        CA: 5202,
        CO: 12950,
        CT: 0, // No standard deduction
        DE: 3250,
        FL: 0, // No state income tax
        GA: 4600,
        HI: 2200,
        ID: 12950,
        IL: 0, // No standard deduction
        IN: 0, // No standard deduction
        IA: 2210,
        KS: 3500,
        KY: 2770,
        LA: 4500,
        ME: 12950,
        MD: 2300,
        MA: 0, // No standard deduction
        MI: 0, // No standard deduction
        MN: 12900,
        MS: 2300,
        MO: 12950,
        MT: 4830,
        NE: 7350,
        NV: 0, // No state income tax
        NH: 0, // Only taxes interest and dividends
        NJ: 0, // No standard deduction
        NM: 12950,
        NY: 8000,
        NC: 12950,
        ND: 12950,
        OH: 0, // No standard deduction
        OK: 6350,
        OR: 2420,
        PA: 0, // No standard deduction
        RI: 9300,
        SC: 12950,
        SD: 0, // No state income tax
        TN: 0, // No state income tax
        TX: 0, // No state income tax
        UT: 0, // No standard deduction
        VT: 6350,
        VA: 4500,
        WA: 0, // No state income tax
        WV: 0, // No standard deduction
        WI: 11790,
        WY: 0 // No state income tax
    },
    QBI_DEDUCTION: 0.20, // 20% of qualified business income
    MEALS_DEDUCTION: 0.50 // 50% of meal expenses are deductible
};

// S corporation specific state tax rules
const SCORP_STATE_RULES = {
    DC: { recognizeScorp: false }, // Treats as C corp
    NH: { recognizeScorp: false }, // Treats as C corp
    TN: { recognizeScorp: false }, // Treats as C corp
    
    // States that tax S corps on part of their income
    MA: { profitTaxThreshold: 1000000, profitTaxRate: 0.02 }, // Tax on profits above threshold
    IN: { capitalGainsRate: 0.0315, passiveIncomeRate: 0.0315 }, // Tax on capital gains and excess passive income
    KY: { capitalGainsRate: 0.045, passiveIncomeRate: 0.045 }, // Tax on capital gains and excess passive income
    ID: { capitalGainsRate: 0.058, passiveIncomeRate: 0.058 }, // Similar to IN/KY
    ME: { capitalGainsRate: 0.0715, passiveIncomeRate: 0.0715 }, // Similar to IN/KY
    WI: { capitalGainsRate: 0.0765, passiveIncomeRate: 0.0765 }, // Similar to IN/KY
    
    // States that double tax (both corp and shareholders)
    MI: { 
        corporateRate: 0.0425, // Single business tax
        exemptionThreshold: 350000 // Exempt if gross receipts below this
    },
    CA: {
        minimumTax: 800,
        corporateRate: 0.015 // 1.5% of taxable income
    },
    NJ: { corporateRate: 0.0925 }, // Corporate tax rate on S corp income
    NY: { corporateRate: 0.065 } // Corporate tax rate on S corp income
};

const STATE_FEES = {
    AL: 200,  // Annual LLC fee
    AK: 100,  // Biennial report fee
    AZ: 50,   // Annual report fee
    AR: 150,  // Annual franchise tax
    CA: 800,  // Annual LLC fee
    CO: 50,   // Annual report fee
    CT: 250,  // Annual report fee
    DE: 300,  // Annual franchise tax
    FL: 150,  // Annual report fee
    GA: 50,   // Annual registration fee
    HI: 15,   // Annual report fee
    ID: 20,   // Annual report fee
    IL: 75,   // Annual report fee
    IN: 50,   // Business entity report fee
    IA: 60,   // Biennial report fee
    KS: 55,   // Annual report fee
    KY: 15,   // Annual report fee
    LA: 35,   // Annual report fee
    ME: 85,   // Annual report fee
    MD: 300,  // Annual report fee
    MA: 500,  // Annual report fee
    MI: 25,   // Annual report fee
    MN: 135,  // Annual renewal fee
    MS: 25,   // Annual report fee
    MO: 45,   // Annual registration fee
    MT: 20,   // Annual report fee
    NE: 10,   // Biennial report fee
    NV: 350,  // Annual list fee
    NH: 100,  // Annual report fee
    NJ: 75,   // Annual report fee
    NM: 50,   // Annual report fee
    NY: 250,  // Annual filing fee
    NC: 200,  // Annual report fee
    ND: 50,   // Annual report fee
    OH: 99,   // Annual report fee
    OK: 25,   // Annual report fee
    OR: 100,  // Annual report fee
    PA: 70,   // Decennial report fee
    RI: 50,   // Annual report fee
    SC: 110,  // Annual report fee
    SD: 50,   // Annual report fee
    TN: 300,  // Annual report fee
    TX: 300,  // Annual franchise tax minimum
    UT: 20,   // Annual renewal fee
    VT: 35,   // Annual report fee
    VA: 50,   // Annual registration fee
    WA: 200,  // Annual report fee
    WV: 25,   // Annual report fee
    WI: 25,   // Annual report fee
    WY: 60    // Annual report fee
};

// Utility functions
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Calculate regular state income tax
function calculateBaseStateTax(taxableIncome, state) {
    if (!TAX_RATES.STATE[state] || TAX_RATES.STATE[state].length === 0) {
        return 0; // No state income tax
    }

    let tax = 0;
    let previousBracket = 0;

    for (const bracket of TAX_RATES.STATE[state]) {
        if (taxableIncome > previousBracket) {
            const taxableAmount = Math.min(taxableIncome - previousBracket, bracket.bracket - previousBracket);
            tax += taxableAmount * bracket.rate;
        }
        if (taxableIncome <= bracket.bracket) break;
        previousBracket = bracket.bracket;
    }

    return tax;
}

// Calculate S corporation specific state tax including special rules
function calculateSCorpStateTax(params) {
    const {
        state,
        grossIncome,
        stateTaxableIncome,
        dividendAmount,
        employerFica,
        totalDeductionsWithFees
    } = params;

    let stateTax = 0;
    const rules = SCORP_STATE_RULES[state];

    if (rules) {
        // States that don't recognize S corps - treat as C corp
        if (rules.recognizeScorp === false) {
            // For non-recognizing states, only allow standard C corp deductions
            // Don't subtract S corp specific items like employerFica
            const cCorpTaxableIncome = grossIncome - totalDeductionsWithFees;
            return calculateBaseStateTax(cCorpTaxableIncome, state);
        }

        // Calculate base state tax on S corp income
        stateTax = calculateBaseStateTax(stateTaxableIncome, state);

        // States with profit threshold tax (e.g., Massachusetts)
        if (rules.profitTaxThreshold) {
            const taxableProfit = Math.max(grossIncome - totalDeductionsWithFees - employerFica - rules.profitTaxThreshold, 0);
            stateTax += taxableProfit * rules.profitTaxRate;
        }

        // States that tax capital gains and passive income
        if (rules.capitalGainsRate || rules.passiveIncomeRate) {
            // Assume 15% of dividend income is from capital gains and passive income
            const capitalGainsAndPassiveIncome = dividendAmount * 0.15;
            stateTax += capitalGainsAndPassiveIncome * (rules.capitalGainsRate || 0);
        }

        // States with corporate level tax
        if (rules.corporateRate) {
            if (rules.exemptionThreshold) {
                // Only apply corporate tax if above threshold (e.g., Michigan)
                if (grossIncome > rules.exemptionThreshold) {
                    stateTax += (grossIncome - totalDeductionsWithFees) * rules.corporateRate;
                }
            } else {
                // Apply minimum tax if applicable (e.g., California)
                if (rules.minimumTax) {
                    stateTax += Math.max(rules.minimumTax, (grossIncome - totalDeductionsWithFees) * rules.corporateRate);
                } else {
                    stateTax += (grossIncome - totalDeductionsWithFees) * rules.corporateRate;
                }
            }
        }
    } else {
        // For states without special S corp rules, just calculate normal state tax
        stateTax = calculateBaseStateTax(stateTaxableIncome, state);
    }

    return stateTax;
}

function calculateFederalTax(taxableIncome) {
    let tax = 0;
    let previousBracket = 0;

    for (const bracket of TAX_RATES.FEDERAL) {
        if (taxableIncome > previousBracket) {
            const taxableAmount = Math.min(taxableIncome - previousBracket, bracket.bracket - previousBracket);
            tax += taxableAmount * bracket.rate;
        }
        if (taxableIncome <= bracket.bracket) break;
        previousBracket = bracket.bracket;
    }

    return tax;
}

function calculateFICA(salary, isEmployer = false) {
    const ssTax = Math.min(salary, TAX_RATES.FICA.SOCIAL_SECURITY_MAX) * TAX_RATES.FICA.SOCIAL_SECURITY;
    const medicareTax = salary * TAX_RATES.FICA.MEDICARE;
    const additionalMedicare = salary > 200000 ? (salary - 200000) * TAX_RATES.FICA.ADDITIONAL_MEDICARE : 0;
    
    return isEmployer ? (ssTax + medicareTax) : (ssTax + medicareTax + additionalMedicare);
}

// Main calculation functions
function calculateW2(baseWages, state) {
    const ficaTax = calculateFICA(baseWages);
    const federalTaxableIncome = Math.max(baseWages - TAX_RATES.FEDERAL_STANDARD_DEDUCTION - (ficaTax / 2), 0);
    const federalTax = calculateFederalTax(federalTaxableIncome);
    const stateStandardDeduction = TAX_RATES.STATE_STANDARD_DEDUCTION[state] || 0;
    const stateTax = calculateBaseStateTax(Math.max(baseWages - stateStandardDeduction, 0), state);

    return {
        grossIncome: baseWages,
        standardDeduction: TAX_RATES.STANDARD_DEDUCTION,
        ficaTax,
        federalTax,
        stateTax,
        netIncome: baseWages - ficaTax - federalTax - stateTax
    };
}

function calculateSCorp(params) {
    const {
        baseWages,
        contractorPremium,
        salaryRatio,
        rdPercentage,
        healthInsurance,
        deductions,
        state,
        stateFees
    } = params;

    // Calculate gross income with contractor premium
    const grossIncome = baseWages * (1 + (contractorPremium / 100));
    
    // Calculate salary and dividend split
    const salaryAmount = grossIncome * (salaryRatio / 100);
    const dividendAmount = grossIncome - salaryAmount;
    
    // Calculate deductions with special handling for meals
    const totalDeductions = Object.entries(deductions).reduce((sum, [key, val]) => {
        if (key === 'meals') {
            return sum + (val * TAX_RATES.MEALS_DEDUCTION);
        }
        return sum + val;
    }, 0);

    // Add state fees to deductions
    const totalDeductionsWithFees = totalDeductions + stateFees;
    
    const rdCredit = salaryAmount * (rdPercentage / 100) * 0.065; // 6.5% R&D credit
    
    // Calculate FICA on salary portion
    const ficaTax = calculateFICA(salaryAmount);
    const employerFica = calculateFICA(salaryAmount, true);
    
    // Calculate QBI deduction after business deductions
    const qbiDeduction = (dividendAmount - employerFica - totalDeductionsWithFees) * TAX_RATES.QBI_DEDUCTION;
    
    // Calculate federal taxable income
    const federalTaxableIncome = Math.max((salaryAmount + dividendAmount) - 
                         TAX_RATES.FEDERAL_STANDARD_DEDUCTION -
                         (totalDeductionsWithFees + employerFica + healthInsurance + qbiDeduction), 0);
    
    // Calculate state taxable income (some states may handle deductions differently)
    const stateStandardDeduction = TAX_RATES.STATE_STANDARD_DEDUCTION[state] || 0;
    const stateTaxableIncome = Math.max((salaryAmount + dividendAmount) - 
                         stateStandardDeduction -
                         (totalDeductionsWithFees + employerFica + healthInsurance), 0);
    
    // Calculate taxes
    const federalTax = calculateFederalTax(federalTaxableIncome) - rdCredit;
    const stateTax = calculateSCorpStateTax({
        state,
        grossIncome,
        stateTaxableIncome,
        dividendAmount,
        employerFica,
        totalDeductionsWithFees
    });
    
    // Calculate net income (business deductions and fees are reimbursed)
    const netIncome = grossIncome - 
                     ficaTax - 
                     federalTax - 
                     stateTax - 
                     healthInsurance -
                     stateFees;

    return {
        grossIncome,
        salaryAmount,
        dividendAmount,
        deductions: totalDeductionsWithFees,
        ficaTax,
        employerFica,
        healthInsurance,
        qbiDeduction,
        rdCredit,
        federalTax,
        stateTax,
        netIncome
    };
}

// UI update functions
function updateW2Results(results) {
    const w2Results = document.getElementById('w2Results');
    w2Results.innerHTML = `
        <div class="result-row">
            <span class="result-label">Gross Income:</span>
            <span class="result-value">${formatMoney(results.grossIncome)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Federal Standard Deduction:</span>
            <span class="result-value">-${formatMoney(TAX_RATES.FEDERAL_STANDARD_DEDUCTION)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">FICA Tax:</span>
            <span class="result-value">-${formatMoney(results.ficaTax)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Federal Tax:</span>
            <span class="result-value">-${formatMoney(results.federalTax)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">State Tax:</span>
            <span class="result-value">-${formatMoney(results.stateTax)}</span>
        </div>
        <div class="result-row result-total">
            <span class="result-label">Net Income:</span>
            <span class="result-value">${formatMoney(results.netIncome)}</span>
        </div>
    `;
}

function updateSCorpResults(results) {
    const sCorpResults = document.getElementById('sCorpResults');
    sCorpResults.innerHTML = `
        <div class="result-row">
            <span class="result-label">Gross Income:</span>
            <span class="result-value">${formatMoney(results.grossIncome)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Salary:</span>
            <span class="result-value">${formatMoney(results.salaryAmount)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Dividends:</span>
            <span class="result-value">${formatMoney(results.dividendAmount)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Federal Standard Deduction:</span>
            <span class="result-value">-${formatMoney(TAX_RATES.FEDERAL_STANDARD_DEDUCTION)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Business Deductions:</span>
            <span class="result-value">-${formatMoney(results.deductions)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">FICA Tax:</span>
            <span class="result-value">-${formatMoney(results.ficaTax)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Employer FICA:</span>
            <span class="result-value">-${formatMoney(results.employerFica)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Health Insurance:</span>
            <span class="result-value">-${formatMoney(results.healthInsurance)}</span>
        </div>
        <div class="result-row result-subtotal">
            <span class="result-label">QBI Deduction:</span>
            <span class="result-value">-${formatMoney(results.qbiDeduction)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">R&D Credit:</span>
            <span class="result-value">+${formatMoney(results.rdCredit)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Federal Tax:</span>
            <span class="result-value">-${formatMoney(results.federalTax)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">State Tax:</span>
            <span class="result-value">-${formatMoney(results.stateTax)}</span>
        </div>
        <div class="result-row result-total">
            <span class="result-label">Net Income:</span>
            <span class="result-value">${formatMoney(results.netIncome)}</span>
        </div>
    `;
}

function updateNetDifference(w2Results, sCorpResults) {
    const netDifference = document.getElementById('netDifference');
    const difference = sCorpResults.netIncome - w2Results.netIncome;
    const formattedDiff = formatMoney(Math.abs(difference));
    
    netDifference.innerHTML = `
        <span class="${difference >= 0 ? 'positive-diff' : 'negative-diff'}">
            ${difference >= 0 ? '+' : '-'} ${formattedDiff} as S-Corp
        </span>
    `;
}

// Event listeners and initialization
function initializeEventListeners() {
    const inputs = [
        'baseWages',
        'state',
        'contractorPremium',
        'salaryRatio',
        'rdPercentage',
        'healthInsurance',
        'deductionTravel',
        'deductionCommute',
        'deductionHomeOffice',
        'deductionMeals',
        'deductionPhone',
        'deductionAugusta',
        'stateFees'
    ];

    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateCalculations);
            if (element.type === 'range') {
                element.addEventListener('input', () => {
                    document.getElementById(`${id}Value`).textContent = `${element.value}%`;
                });
            }
        }
    });

    // Set initial state fees based on default state
    const stateSelect = document.getElementById('state');
    const stateFeesInput = document.getElementById('stateFees');
    stateFeesInput.value = STATE_FEES[stateSelect.value];

    // Update state fees when state changes
    stateSelect.addEventListener('change', () => {
        stateFeesInput.value = STATE_FEES[stateSelect.value];
        updateCalculations();
    });

    updateCalculations();
}

function updateCalculations() {
    const baseWages = parseFloat(document.getElementById('baseWages').value) || 0;
    const state = document.getElementById('state').value;
    const contractorPremium = parseFloat(document.getElementById('contractorPremium').value) || 0;
    const salaryRatio = parseFloat(document.getElementById('salaryRatio').value) || 0;
    const rdPercentage = parseFloat(document.getElementById('rdPercentage').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    const stateFees = parseFloat(document.getElementById('stateFees').value) || 0;

    const deductions = {
        travel: parseFloat(document.getElementById('deductionTravel').value) || 0,
        commute: parseFloat(document.getElementById('deductionCommute').value) || 0,
        homeOffice: parseFloat(document.getElementById('deductionHomeOffice').value) || 0,
        meals: parseFloat(document.getElementById('deductionMeals').value) || 0,
        phone: parseFloat(document.getElementById('deductionPhone').value) || 0,
        augusta: parseFloat(document.getElementById('deductionAugusta').value) || 0
    };

    const w2Results = calculateW2(baseWages, state);
    const sCorpResults = calculateSCorp({
        baseWages,
        contractorPremium,
        salaryRatio,
        rdPercentage,
        healthInsurance,
        deductions,
        state,
        stateFees
    });

    updateW2Results(w2Results);
    updateSCorpResults(sCorpResults);
    updateNetDifference(w2Results, sCorpResults);
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', initializeEventListeners);

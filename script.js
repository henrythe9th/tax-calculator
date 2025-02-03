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
    STANDARD_DEDUCTION: 14600, // 2024 single filer
    QBI_DEDUCTION: 0.20, // 20% of qualified business income
    MEALS_DEDUCTION: 0.50 // 50% of meal expenses are deductible
};

// Utility functions
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
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
function calculateW2(baseWages) {
    const ficaTax = calculateFICA(baseWages);
    const taxableIncome = Math.max(baseWages - TAX_RATES.STANDARD_DEDUCTION, 0); // Standard deduction and half of FICA
    const federalTax = calculateFederalTax(taxableIncome);

    return {
        grossIncome: baseWages,
        standardDeduction: TAX_RATES.STANDARD_DEDUCTION,
        ficaTax,
        federalTax,
        netIncome: baseWages - ficaTax - federalTax
    };
}

function calculateSCorp(params) {
    const {
        baseWages,
        contractorPremium,
        salaryRatio,
        rdPercentage,
        healthInsurance,
        deductions
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
    const rdCredit = salaryAmount * (rdPercentage / 100) * 0.065; // 6.5% R&D credit
    
    // Calculate FICA on salary portion
    const ficaTax = calculateFICA(salaryAmount);
    const employerFica = calculateFICA(salaryAmount, true);
    
    // Calculate QBI deduction after business deductions
    const qbiDeduction = (dividendAmount - employerFica - totalDeductions) * TAX_RATES.QBI_DEDUCTION;
    
    // Calculate taxable income with standard deduction
    const taxableIncome = Math.max((salaryAmount + dividendAmount) - 
                         TAX_RATES.STANDARD_DEDUCTION -
                         (totalDeductions + employerFica + healthInsurance + qbiDeduction), 0);
    
    // Calculate federal tax
    const federalTax = calculateFederalTax(taxableIncome) - rdCredit;
    
    // Calculate net income (business deductions are reimbursed)
    const netIncome = grossIncome - 
                     ficaTax - 
                     federalTax - 
                     healthInsurance;

    return {
        grossIncome,
        salaryAmount,
        dividendAmount,
        deductions: totalDeductions,
        ficaTax,
        employerFica,
        healthInsurance,
        qbiDeduction,
        rdCredit,
        federalTax,
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
            <span class="result-label">Standard Deduction:</span>
            <span class="result-value">-${formatMoney(results.standardDeduction)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">FICA Tax:</span>
            <span class="result-value">-${formatMoney(results.ficaTax)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Federal Tax:</span>
            <span class="result-value">-${formatMoney(results.federalTax)}</span>
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
            <span class="result-label">Standard Deduction:</span>
            <span class="result-value">-${formatMoney(TAX_RATES.STANDARD_DEDUCTION)}</span>
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
        'contractorPremium',
        'salaryRatio',
        'rdPercentage',
        'healthInsurance',
        'deductionTravel',
        'deductionCommute',
        'deductionHomeOffice',
        'deductionMeals',
        'deductionPhone',
        'deductionAugusta'
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

    updateCalculations();
}

function updateCalculations() {
    const baseWages = parseFloat(document.getElementById('baseWages').value) || 0;
    const contractorPremium = parseFloat(document.getElementById('contractorPremium').value) || 0;
    const salaryRatio = parseFloat(document.getElementById('salaryRatio').value) || 0;
    const rdPercentage = parseFloat(document.getElementById('rdPercentage').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;

    const deductions = {
        travel: parseFloat(document.getElementById('deductionTravel').value) || 0,
        commute: parseFloat(document.getElementById('deductionCommute').value) || 0,
        homeOffice: parseFloat(document.getElementById('deductionHomeOffice').value) || 0,
        meals: parseFloat(document.getElementById('deductionMeals').value) || 0,
        phone: parseFloat(document.getElementById('deductionPhone').value) || 0,
        augusta: parseFloat(document.getElementById('deductionAugusta').value) || 0
    };

    const w2Results = calculateW2(baseWages);
    const sCorpResults = calculateSCorp({
        baseWages,
        contractorPremium,
        salaryRatio,
        rdPercentage,
        healthInsurance,
        deductions
    });

    updateW2Results(w2Results);
    updateSCorpResults(sCorpResults);
    updateNetDifference(w2Results, sCorpResults);
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', initializeEventListeners);
